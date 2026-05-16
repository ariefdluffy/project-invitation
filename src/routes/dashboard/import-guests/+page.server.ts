import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { addGuest } from '$lib/server/invitations';
import { logAudit } from '$lib/server/audit-log';

export const load: PageServerLoad = async ({ locals }) => {
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) return fail(401);

		const formData = await request.formData();
		const invitationId = formData.get('invitation_id') as string;
		const csvText = formData.get('csv') as string;

		if (!invitationId) return fail(400, { error: 'ID undangan diperlukan' });
		if (!csvText || csvText.trim().length === 0) {
			return fail(400, { error: 'Data CSV kosong' });
		}

		const lines = csvText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
		let added = 0;
		let skipped = 0;

		for (const line of lines) {
			const names = line.split(/[,;\t]/).map(n => n.trim()).filter(n => n.length > 0);

			for (const name of names) {
				if (name.length > 100) {
					skipped++;
					continue;
				}
				try {
					await addGuest(invitationId, name);
					added++;
				} catch {
					skipped++;
				}
			}
		}

		logAudit({
			action: 'invitation.update',
			userId: locals.user.id,
			details: `Imported ${added} guests via CSV (${skipped} skipped)`,
			metadata: { invitationId, added, skipped }
		}).catch(() => {});

		return {
			success: true,
			added,
			skipped,
			message: `Berhasil import ${added} tamu${skipped > 0 ? ` (${skipped} dilewati)` : ''}`
		};
	}
};
