import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";
import {
  createUser,
  updateUserAccess,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserPassword,
} from "$lib/server/users";
import { generateRandomPassword } from "$lib/server/utils";
import { checkRateLimit, ipKey } from "$lib/server/rate-limiter";
import { logAudit } from "$lib/server/audit-log";
import type { User } from "$lib/server/users";

const PAYMENT_FILTERS = ["all", "paid", "pending", "payments"] as const;
type PaymentFilter = (typeof PAYMENT_FILTERS)[number];

function filterUsersByPayment(users: User[], filter: PaymentFilter): User[] {
  if (filter === "paid")
    return users.filter((u) => u.payment_status === "paid");
  if (filter === "pending")
    return users.filter((u) => u.payment_status === "pending");
  if (filter === "payments")
    return users.filter(
      (u) => u.payment_status === "paid" || u.payment_status === "pending",
    );
  return users;
}

const PAGE_SIZE = 20;

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user || locals.user.role !== "admin") {
    return {
      users: [],
      filter: "all" as PaymentFilter,
      counts: { all: 0, paid: 0, pending: 0, payments: 0 },
      pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 0 },
    };
  }

  const raw = url.searchParams.get("filter") || "all";
  const filter: PaymentFilter = PAYMENT_FILTERS.includes(raw as PaymentFilter)
    ? (raw as PaymentFilter)
    : "all";
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));

  // Get counts for filter chips (always full table scan)
  const allUsers = await getAllUsers();
  const counts = {
    all: allUsers.length,
    paid: allUsers.filter((u) => u.payment_status === "paid").length,
    pending: allUsers.filter((u) => u.payment_status === "pending").length,
    payments: allUsers.filter(
      (u) => u.payment_status === "paid" || u.payment_status === "pending",
    ).length,
  };

  // Apply filter and paginate in-memory (counts still need full scan)
  const filtered = filterUsersByPayment(allUsers, filter);
  const total = filtered.length;
  const offset = (page - 1) * PAGE_SIZE;
  const paginatedUsers = filtered.slice(offset, offset + PAGE_SIZE);

  return {
    users: paginatedUsers,
    filter,
    counts,
    pagination: { page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) },
  };
};

export const actions: Actions = {
  addUser: async ({ request, locals, getClientAddress }) => {
    if (!locals.user || locals.user.role !== "admin") {
      return fail(403, { error: "Tidak memiliki akses" });
    }

    const rl = checkRateLimit(ipKey(getClientAddress(), 'admin-adduser'), { maxRequests: 10, windowMs: 60000 });
    if (!rl.allowed) return fail(429, { error: 'Terlalu banyak percobaan. Coba lagi nanti.' });

    const formData = await request.formData();
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = (formData.get("role") as string) || "user";

    if (!username || !email || !password) {
      return fail(400, { error: "Semua field wajib diisi" });
    }

    try {
      await createUser(username, email, password, role);
      return { success: true, message: "User berhasil ditambahkan" };
    } catch (err) {
      return fail(400, {
        error: "Username atau email mungkin sudah digunakan",
      });
    }
  },

  updateAccess: async ({ request, locals, getClientAddress }) => {
    if (!locals.user || locals.user.role !== "admin") {
      return fail(403, { error: "Tidak memiliki akses" });
    }

    const rl = checkRateLimit(ipKey(getClientAddress(), 'admin-update'), { maxRequests: 30, windowMs: 60000 });
    if (!rl.allowed) return fail(429, { error: 'Terlalu banyak permintaan. Coba lagi nanti.' });

    const formData = await request.formData();
    const id = formData.get("id") as string;
    const hasAccess = formData.get("has_access") === "on" ? 1 : 0;

    // Hanya update payment_status jika field dikirim dalam form
    // Ini memastikan toggle aktivasi tidak mengubah payment_status
    const paymentStatus = formData.has("payment_status")
      ? (formData.get("payment_status") as string)
      : undefined;

    const invitationLimit =
      parseInt(formData.get("invitation_limit") as string) || 1;
    const guestLimit = parseInt(formData.get("guest_limit") as string) || 50;

    try {
      await updateUserAccess(
        id,
        hasAccess,
        paymentStatus,
        invitationLimit,
        guestLimit,
      );
      return { success: true, message: "Akses user berhasil diperbarui" };
    } catch (err) {
      return fail(400, { error: "Gagal memperbarui akses user" });
    }
  },

  bulkAction: async ({ request, locals, getClientAddress }) => {
    if (!locals.user || locals.user.role !== "admin") {
      return fail(403, { error: "Tidak memiliki akses" });
    }

    const rl = checkRateLimit(ipKey(getClientAddress(), 'admin-bulk'), { maxRequests: 10, windowMs: 60000 });
    if (!rl.allowed) return fail(429, { error: 'Terlalu banyak permintaan. Coba lagi nanti.' });

    const formData = await request.formData();
    const actionType = formData.get('action_type') as string;
    const userIdsRaw = formData.get('user_ids') as string;
    if (!actionType || !userIdsRaw) return fail(400, { error: 'Parameter tidak lengkap' });

    const userIds = userIdsRaw.split(',').map(s => s.trim()).filter(Boolean);
    if (userIds.length === 0) return fail(400, { error: 'Tidak ada user dipilih' });

    let processed = 0;
    let skipped = 0;

    for (const uid of userIds) {
      try {
        const user = await getUserById(uid);
        if (!user) { skipped++; continue; }

        if (actionType === 'activate') {
          await updateUserAccess(uid, 1, 'paid', user.invitation_limit || 5, user.guest_limit || 100);
          processed++;
        } else if (actionType === 'deactivate') {
          await updateUserAccess(uid, 0, 'unpaid');
          processed++;
        } else if (actionType === 'delete') {
          if (user.role === 'admin') { skipped++; continue; }
          await deleteUser(uid);
          processed++;
        }
      } catch (err) {
        console.error(`[Bulk] Error processing user ${uid}:`, err);
        skipped++;
      }
    }

    logAudit({
      action: 'admin.user_update',
      userId: locals.user.id,
      details: `Bulk ${actionType}: ${processed} processed, ${skipped} skipped`
    }).catch(() => {});

    return { success: true, message: `${actionType}: ${processed} berhasil${skipped > 0 ? `, ${skipped} dilewati` : ''}` };
  },

  delete: async ({ request, locals, getClientAddress }) => {
    if (!locals.user || locals.user.role !== "admin") {
      return fail(403, { error: "Tidak memiliki akses" });
    }

    const rl = checkRateLimit(ipKey(getClientAddress(), 'admin-delete'), { maxRequests: 5, windowMs: 60000 });
    if (!rl.allowed) return fail(429, { error: 'Terlalu banyak percobaan. Coba lagi nanti.' });

    const formData = await request.formData();
    const id = formData.get("id") as string;

    // Prevent deleting the last admin or any admin for safety
    const userToDelete = await getUserById(id);
    if (userToDelete?.role === "admin") {
      return fail(400, {
        error: "Akun Administrator tidak dapat dihapus untuk alasan keamanan.",
      });
    }

    try {
      await deleteUser(id);
      return { success: true, message: "User berhasil dihapus" };
    } catch (err) {
      return fail(400, { error: "Gagal menghapus user" });
    }
  },

  resetPassword: async ({ request, locals, getClientAddress }) => {
    if (!locals.user || locals.user.role !== "admin") {
      return fail(403, { error: "Tidak memiliki akses" });
    }

    const rl = checkRateLimit(ipKey(getClientAddress(), 'admin-resetpw'), { maxRequests: 5, windowMs: 60000 });
    if (!rl.allowed) return fail(429, { error: 'Terlalu banyak percobaan. Coba lagi nanti.' });

    const formData = await request.formData();
    const id = formData.get("id") as string;

    if (!id) {
      return fail(400, { error: "ID pengguna tidak valid." });
    }

    try {
      const user = await getUserById(id);
      const newRandomPassword = generateRandomPassword();
      await updateUserPassword(id, newRandomPassword);
      if (user) {
        try {
          const { sendAdminResetNotification } = await import('$lib/server/email');
          const { getSetting } = await import('$lib/server/settings');
          const appName = await getSetting('app_name') || 'Wedding Invitation';
          await sendAdminResetNotification(user.email, newRandomPassword, user.username, appName);
        } catch (emailErr) {
          console.warn('[Admin Users] Gagal kirim email reset:', emailErr);
        }
      }
      return {
        success: true,
        message: `Password berhasil direset. Password baru: ${newRandomPassword}`,
        newPassword: newRandomPassword,
      };
    } catch (err) {
      console.error("[Admin Users] Error resetting password:", err);
      return fail(500, { error: "Gagal mereset password user." });
    }
  },
};
