<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/toast.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let showResetModal = $state(false);
	let showDeleteModal = $state(false);
	let newPassword = $state('');

	function handleFormEnhance() {
		return async ({ result, update }: any) => {
			await update();
			if (result.type === 'success') {
				const d = result.data as { message?: string; newPassword?: string };
				if (d?.message) toast.success(d.message, 15000);
				if (d?.newPassword) newPassword = d.newPassword;
				showResetModal = false;
			} else if (result.type === 'failure') {
				const d = result.data as { error?: string };
				if (d?.error) toast.error(d.error);
			}
		};
	}

	const user = $derived(data.user);
</script>

<svelte:head><title>{user.username} - Admin</title></svelte:head>

<div class="dash-header">
	<a href="/admin/users" class="btn btn-secondary btn-sm">← Kembali</a>
	<h1>👤 {user.username}</h1>
</div>

<!-- User Info -->
<div class="dash-grid-2">
	<div class="dash-card">
		<h3 style="margin-bottom:1rem">Info Akun</h3>
		<table class="detail-table">
			<tbody>
				<tr><td>Email</td><td>{user.email}</td></tr>
				<tr><td>Role</td><td><span class="badge {user.role === 'admin' ? 'badge-info' : 'badge-success'}">{user.role}</span></td></tr>
				<tr><td>Akses</td><td>{user.has_access ? 'Aktif' : 'Nonaktif'}</td></tr>
				<tr><td>Status Bayar</td><td><span class="badge badge-{user.payment_status}">{user.payment_status}</span></td></tr>
				<tr><td>Limit Undangan</td><td>{user.invitation_limit}</td></tr>
				<tr><td>Limit Tamu</td><td>{user.guest_limit}</td></tr>
				<tr><td>Trial</td><td>{user.trial_ends_at || '-'}</td></tr>
				<tr><td>Akses Expired</td><td>{user.access_expires_at || 'Permanen'}</td></tr>
				<tr><td>Terdaftar</td><td>{new Date(user.created_at).toLocaleString('id-ID')}</td></tr>
			</tbody>
		</table>

		<div style="margin-top:1.5rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
			<form method="POST" action="?/resetPassword" use:enhance={handleFormEnhance}>
				<input type="hidden" name="id" value={user.id} />
				<button type="submit" class="btn btn-secondary btn-sm">🔑 Reset Password</button>
			</form>
			{#if user.role !== 'admin'}
				<form method="POST" action="?/delete" use:enhance={handleFormEnhance}>
					<input type="hidden" name="id" value={user.id} />
					<button type="submit" class="btn btn-danger btn-sm" onclick={(e) => { if (!confirm('Yakin hapus user ini?')) e.preventDefault(); }}>🗑️ Hapus User</button>
				</form>
			{/if}
		</div>

		{#if newPassword}
			<div class="password-display">
				<strong>Password baru:</strong> <code>{newPassword}</code>
				<button class="btn btn-secondary btn-sm" onclick={() => { navigator.clipboard.writeText(newPassword); toast.success('Disalin!'); }}>📋 Salin</button>
			</div>
		{/if}
	</div>

	<!-- Edit Access -->
	<div class="dash-card">
		<h3 style="margin-bottom:1rem">Edit Akses</h3>
		<form method="POST" action="?/updateAccess" use:enhance={handleFormEnhance}>
			<input type="hidden" name="id" value={user.id} />
			<div class="form-group">
				<label>Akses</label>
				<label class="switch">
					<input type="checkbox" name="has_access" checked={user.has_access === 1} />
					<span class="slider round"></span>
				</label>
			</div>
			<div class="form-group">
				<label>Status Bayar</label>
				<select name="payment_status" class="form-control">
					<option value="unpaid" selected={user.payment_status === 'unpaid'}>Belum bayar</option>
					<option value="pending" selected={user.payment_status === 'pending'}>Menunggu</option>
					<option value="paid" selected={user.payment_status === 'paid'}>Sudah bayar</option>
					<option value="inactive" selected={user.payment_status === 'inactive'}>Dibatalkan</option>
				</select>
			</div>
			<div class="form-group">
				<label>Limit Undangan</label>
				<input type="number" name="invitation_limit" class="form-control" value={user.invitation_limit} min="1" />
			</div>
			<div class="form-group">
				<label>Limit Tamu</label>
				<input type="number" name="guest_limit" class="form-control" value={user.guest_limit} min="1" />
			</div>
			<button type="submit" class="btn btn-primary">Simpan</button>
		</form>
	</div>
</div>

<!-- Undangan User -->
<div class="dash-card" style="margin-top:1.5rem">
	<h3 style="margin-bottom:1rem">💌 Undangan ({data.invitations.length})</h3>
	{#if data.invitations.length === 0}
		<p class="muted">Belum ada undangan</p>
	{:else}
		<table class="dash-table">
			<thead><tr><th>Nama</th><th>Slug</th><th>Status</th><th>Aksi</th></tr></thead>
			<tbody>
				{#each data.invitations as inv}
					<tr>
						<td>{inv.bride_name} & {inv.groom_name}</td>
						<td>/{inv.slug}</td>
						<td><span class="badge {inv.is_published ? 'badge-success' : 'badge-warning'}">{inv.is_published ? 'Published' : 'Draft'}</span></td>
						<td><a href="/dashboard/invitations/{inv.id}" class="btn btn-secondary btn-sm">Edit</a></td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<!-- Payment History -->
<div class="dash-card" style="margin-top:1.5rem">
	<h3 style="margin-bottom:1rem">💳 Riwayat Pembayaran ({data.payments.length})</h3>
	{#if data.payments.length === 0}
		<p class="muted">Belum ada transaksi</p>
	{:else}
		<table class="dash-table">
			<thead><tr><th>Order ID</th><th>Tipe</th><th>Jumlah</th><th>Status</th><th>Tanggal</th></tr></thead>
			<tbody>
				{#each data.payments as tx}
					<tr>
						<td style="font-family:monospace;font-size:0.8rem">{tx.order_id}</td>
						<td>{tx.type}</td>
						<td>Rp {tx.amount.toLocaleString('id-ID')}</td>
						<td><span class="badge badge-{tx.status}">{tx.status}</span></td>
						<td>{new Date(tx.created_at).toLocaleDateString('id-ID')}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<!-- Login History -->
<div class="dash-card" style="margin-top:1.5rem">
	<h3 style="margin-bottom:1rem">🔐 Login History</h3>
	{#if data.auditLogs.length === 0}
		<p class="muted">Belum ada aktivitas</p>
	{:else}
		<table class="dash-table">
			<thead><tr><th>Aksi</th><th>Detail</th><th>IP</th><th>Waktu</th></tr></thead>
			<tbody>
				{#each data.auditLogs as log}
					<tr>
						<td><span class="badge">{log.action}</span></td>
						<td>{log.details || '-'}</td>
						<td style="font-family:monospace;font-size:0.8rem">{log.ip || '-'}</td>
						<td>{new Date(log.created_at).toLocaleString('id-ID')}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
	.dash-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
	@media (max-width: 900px) { .dash-grid-2 { grid-template-columns: 1fr; } }
	.detail-table { width: 100%; }
	.detail-table td { padding: 0.5rem 0; border-bottom: 1px solid var(--dash-border); }
	.detail-table td:first-child { color: var(--dash-text-muted); font-size: 0.85rem; width: 40%; }
	.muted { color: var(--dash-text-muted); font-size: 0.9rem; }
	.password-display { margin-top: 1rem; padding: 0.75rem; background: rgba(108,99,255,0.08); border-radius: 8px; display: flex; align-items: center; gap: 0.5rem; }
	.password-display code { font-weight: 700; }
	.switch { position: relative; display: inline-block; width: 40px; height: 20px; }
	.switch input { opacity: 0; width: 0; height: 0; }
	.slider { position: absolute; cursor: pointer; inset: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
	.slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
	input:checked + .slider { background-color: var(--dash-accent); }
	input:checked + .slider:before { transform: translateX(20px); }
	.badge-unpaid { background: #fee2e2; color: #ef4444; }
	.badge-paid { background: #dcfce7; color: #22c55e; }
	.badge-pending { background: #fef3c7; color: #b45309; }
	.badge-success { background: #dcfce7; color: #22c55e; }
	.badge-failed { background: #fee2e2; color: #ef4444; }
	.badge-cancelled { background: #e2e8f0; color: #475569; }
</style>
