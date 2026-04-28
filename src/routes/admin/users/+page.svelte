<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/toast.svelte';
	import { invalidateAll } from '$app/navigation';
	import type { User } from '$lib/server/users';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showAddModal = $state(false);
	let showResetModal = $state(false);
	let userToReset = $state<User | null>(null);

	function openResetModal(user: User) {
		userToReset = user;
		showResetModal = true;
	}
	
	$effect(() => {
		if (form?.success) {
			showAddModal = false;
			showResetModal = false;
			
			if (form.message && form.message.includes('Password berhasil direset')) {
				toast.success(form.message, 15000); // Tampilkan toast selama 15 detik
			} else if (form.message) {
				toast.success(form.message);
			}
		} else if (form?.error) {
			toast.error(form.error);
		}
	});
</script>

<svelte:head><title>Users - Admin {data.appName}</title></svelte:head>

<div class="dash-header">
	<div>
		<h1>👥 Manage Users</h1>
		<p class="dash-header-sub">
			Kelola pengguna — saring menurut status pembayaran (sudah bayar / menunggu).
		</p>
	</div>
	<button class="btn btn-primary" onclick={() => showAddModal = true}>
		+ Tambah User
	</button>
</div>

<div class="payment-filter-bar" role="navigation" aria-label="Filter status pembayaran">
	<a
		href="/admin/users"
		class="filter-chip"
		class:filter-chip--active={data.filter === 'all'}
		data-sveltekit-preload-data="tap"
	>
		Semua <span class="filter-count">{data.counts.all}</span>
	</a>
	<a
		href="/admin/users?filter=payments"
		class="filter-chip"
		class:filter-chip--active={data.filter === 'payments'}
		data-sveltekit-preload-data="tap"
	>
		Pembayaran <span class="filter-count">{data.counts.payments}</span>
		<span class="filter-hint">paid + pending</span>
	</a>
	<a
		href="/admin/users?filter=paid"
		class="filter-chip"
		class:filter-chip--active={data.filter === 'paid'}
		data-sveltekit-preload-data="tap"
	>
		Sudah bayar <span class="filter-count">{data.counts.paid}</span>
	</a>
	<a
		href="/admin/users?filter=pending"
		class="filter-chip"
		class:filter-chip--active={data.filter === 'pending'}
		data-sveltekit-preload-data="tap"
	>
		Proses bayar <span class="filter-count">{data.counts.pending}</span>
	</a>
</div>

{#if data.filter !== 'all'}
	<p class="filter-active-note">
		Menampilkan <strong>{data.users.length}</strong> pengguna
		{#if data.filter === 'payments'}
			dengan status <strong>paid</strong> atau <strong>pending</strong>.
		{:else if data.filter === 'paid'}
			dengan status <strong>paid</strong>.
		{:else}
			dengan status <strong>pending</strong> (checkout / menunggu konfirmasi).
		{/if}
		<a href="/admin/users" class="filter-clear">Tampilkan semua</a>
	</p>
{/if}

<div class="dash-card">
	<table class="dash-table">
		<thead>
			<tr>
				<th>Username</th>
				<th>Email</th>
				<th>Role</th>
				<th>Akses</th>
				<th>Status Bayar</th>
				<th>Limit Undangan</th>
				<th>Limit Tamu</th>
				<th>Aksi</th>
				<th>Aksi Lain</th>
			</tr>
		</thead>
		<tbody>
			{#each data.users as user}
				<tr>
					<td>
						<div class="user-cell">
							<span class="avatar-sm">{user.username.charAt(0).toUpperCase()}</span>
							{user.username}
						</div>
					</td>
					<td>{user.email}</td>
					<td><span class="badge {user.role === 'admin' ? 'badge-info' : 'badge-success'}">{user.role}</span></td>
					<td>
						<form method="POST" action="?/updateAccess" use:enhance>
							<input type="hidden" name="id" value={user.id} />
							<input type="hidden" name="payment_status" value={user.payment_status} />
							<input type="hidden" name="invitation_limit" value={user.invitation_limit} />
							<input type="hidden" name="guest_limit" value={user.guest_limit} />
							<label class="switch">
								<input 
									type="checkbox" 
									name="has_access" 
									checked={user.has_access === 1} 
									onchange={(e) => e.target.form.requestSubmit()} 
								/>
								<span class="slider round"></span>
							</label>
						</form>
					</td>
					<td>
						<form method="POST" action="?/updateAccess" use:enhance>
							<input type="hidden" name="id" value={user.id} />
							<input type="hidden" name="has_access" value={user.has_access === 1 ? 'on' : 'off'} />
							<input type="hidden" name="invitation_limit" value={user.invitation_limit} />
							<input type="hidden" name="guest_limit" value={user.guest_limit} />
							<select 
								name="payment_status" 
								class="badge-select {user.payment_status}"
								onchange={(e) => e.target.form.requestSubmit()}
							>
								<option value="unpaid" selected={user.payment_status === 'unpaid'}>Belum bayar</option>
								<option value="pending" selected={user.payment_status === 'pending'}>Menunggu bayar</option>
								<option value="paid" selected={user.payment_status === 'paid'}>Sudah bayar</option>
								<option value="inactive" selected={user.payment_status === 'inactive'}>Dibatalkan</option>
							</select>
						</form>
					</td>
					<td>
						<form method="POST" action="?/updateAccess" use:enhance>
							<input type="hidden" name="id" value={user.id} />
							<input type="hidden" name="has_access" value={user.has_access === 1 ? 'on' : 'off'} />
							<input type="hidden" name="payment_status" value={user.payment_status} />
							<input type="hidden" name="guest_limit" value={user.guest_limit} />
							<input 
								type="number" 
								name="invitation_limit" 
								class="form-control-sm limit-input" 
								value={user.invitation_limit} 
								min="1"
								onchange={(e) => e.target.form.requestSubmit()}
							/>
						</form>
					</td>
					<td>
						<form method="POST" action="?/updateAccess" use:enhance>
							<input type="hidden" name="id" value={user.id} />
							<input type="hidden" name="has_access" value={user.has_access === 1 ? 'on' : 'off'} />
							<input type="hidden" name="payment_status" value={user.payment_status} />
							<input type="hidden" name="invitation_limit" value={user.invitation_limit} />
							<input 
								type="number" 
								name="guest_limit" 
								class="form-control-sm limit-input" 
								value={user.guest_limit} 
								min="1"
								onchange={(e) => e.target.form.requestSubmit()}
							/>
						</form>
					</td>
					<td>
						{#if user.role !== 'admin'}
							<form method="POST" action="?/delete" use:enhance>
								<input type="hidden" name="id" value={user.id} />
								<button 
									type="submit" 
									class="btn-icon btn-danger" 
									onclick={(e) => { if (!confirm('Hapus user ini?')) e.preventDefault(); }}
									title="Hapus User"
								>
									🗑️
								</button>
							</form>
						{:else}
							<span style="font-size: 0.75rem; color: var(--dash-text-muted); opacity: 0.5;">Sistem</span>
						{/if}
					</td>
					<td>
						{#if user.role !== 'admin'}
							<button 
								type="button" 
								class="btn-icon btn-secondary" 
								onclick={() => openResetModal(user)}
								title="Reset Password"
							>
								🔑
							</button>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- Modal Tambah User -->
{#if showAddModal}
	<div class="modal-overlay" onclick={(e) => { if (e.target === e.currentTarget) showAddModal = false; }}>
		<div class="modal-content">
			<div class="modal-header">
				<h2>Tambah User Baru</h2>
				<button class="btn-close" onclick={() => showAddModal = false}>✕</button>
			</div>
			
			{#if form?.error}
				<div class="error-message">{form.error}</div>
			{/if}
			
			<form method="POST" action="?/addUser" use:enhance>
				<div class="form-group">
					<label for="username">Username</label>
					<input type="text" id="username" name="username" class="form-control" placeholder="cth: johndoe" required />
				</div>
				<div class="form-group">
					<label for="email">Email</label>
					<input type="email" id="email" name="email" class="form-control" placeholder="cth: john@example.com" required />
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input type="password" id="password" name="password" class="form-control" placeholder="Minimal 6 karakter" required />
				</div>
				<div class="form-group">
					<label for="role">Role</label>
					<select id="role" name="role" class="form-control">
						<option value="user">User</option>
						<option value="admin">Admin</option>
					</select>
				</div>
				
				<div class="modal-actions">
					<button type="button" class="btn btn-secondary" onclick={() => showAddModal = false}>Batal</button>
					<button type="submit" class="btn btn-primary">Simpan User</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Modal Reset Password -->
{#if showResetModal && userToReset}
	<div class="modal-overlay" onclick={(e) => { if (e.target === e.currentTarget) showResetModal = false; }}>
		<div class="modal-content">
			<div class="modal-header">
				<h2>Reset Password</h2>
				<button class="btn-close" onclick={() => showResetModal = false}>✕</button>
			</div>
			<p>Anda yakin ingin mereset password untuk pengguna <strong>{userToReset.username}</strong>? Password baru akan dibuat secara acak dan ditampilkan setelah proses selesai. Tindakan ini tidak dapat dibatalkan.</p>
			
			<form method="POST" action="?/resetPassword" use:enhance>
				<input type="hidden" name="id" value={userToReset.id} />
				<div class="modal-actions">
					<button type="button" class="btn btn-secondary" onclick={() => showResetModal = false}>Batal</button>
					<button type="submit" class="btn btn-danger">Ya, Reset Password</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.dash-header-sub {
		color: var(--dash-text-muted);
		font-size: 0.95rem;
		margin-top: 0.25rem;
		max-width: 36rem;
	}

	.payment-filter-bar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1.25rem;
	}

	.filter-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.45rem 0.85rem;
		border-radius: var(--radius-full);
		border: 1px solid var(--dash-border);
		background: rgba(255, 255, 255, 0.03);
		color: var(--dash-text-muted);
		font-size: 0.82rem;
		font-weight: 600;
		text-decoration: none;
		transition: all var(--transition-base);
	}

	.filter-chip:hover {
		border-color: rgba(108, 99, 255, 0.4);
		color: var(--dash-text);
	}

	.filter-chip--active {
		background: var(--dash-accent);
		border-color: var(--dash-accent);
		color: #fff;
	}

	.filter-chip--active .filter-hint {
		color: rgba(255, 255, 255, 0.85);
	}

	.filter-count {
		font-size: 0.72rem;
		font-weight: 800;
		opacity: 0.95;
		padding: 0.1rem 0.4rem;
		border-radius: 6px;
		background: rgba(0, 0, 0, 0.12);
	}

	.filter-chip--active .filter-count {
		background: rgba(255, 255, 255, 0.2);
	}

	.filter-hint {
		font-size: 0.65rem;
		font-weight: 500;
		opacity: 0.75;
		margin-left: 0.15rem;
	}

	.filter-active-note {
		font-size: 0.88rem;
		color: var(--dash-text-muted);
		margin: -0.5rem 0 1.25rem;
	}

	.filter-clear {
		margin-left: 0.5rem;
		color: var(--dash-accent);
		font-weight: 600;
	}
	.user-cell {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.avatar-sm {
		width: 28px;
		height: 28px;
		background: linear-gradient(135deg, #6c63ff, #a78bfa);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: 700;
		font-size: 0.7rem;
	}
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}
	.modal-header h2 {
		font-family: var(--font-serif);
		font-size: 1.5rem;
	}
	.btn-close {
		color: var(--dash-text-muted);
		font-size: 1.2rem;
	}
	.btn-close:hover {
		color: var(--color-danger);
	}
	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 2rem;
	}
	.error-message {
		background: rgba(231, 76, 60, 0.1);
		color: var(--color-danger);
		padding: 0.75rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		border: 1px solid rgba(231, 76, 60, 0.3);
	}

	/* Switch Component */
	.switch {
		position: relative;
		display: inline-block;
		width: 40px;
		height: 20px;
	}
	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		transition: .4s;
		border-radius: 34px;
	}
	.slider:before {
		position: absolute;
		content: "";
		height: 14px;
		width: 14px;
		left: 3px;
		bottom: 3px;
		background-color: white;
		transition: .4s;
		border-radius: 50%;
	}
	input:checked + .slider {
		background-color: var(--dash-accent);
	}
	input:checked + .slider:before {
		transform: translateX(20px);
	}

	/* Badge Select */
	.badge-select {
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 600;
		border: 1px solid transparent;
		cursor: pointer;
	}
	.badge-select.unpaid {
		background: #fee2e2;
		color: #ef4444;
	}
	.badge-select.paid {
		background: #dcfce7;
		color: #22c55e;
	}
	.badge-select.pending {
		background: #fef3c7;
		color: #b45309;
	}
	.badge-select.inactive {
		background: #e2e8f0;
		color: #475569;
	}
	
	.btn-icon {
		background: none;
		border: none;
		font-size: 1.1rem;
		cursor: pointer;
		padding: 0.3rem;
		border-radius: 6px;
		transition: background 0.2s;
	}
	.btn-icon:hover {
		background: rgba(0,0,0,0.05);
	}
	.btn-danger:hover {
		color: #ef4444;
	}

	.form-control-sm {
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
		border: 1px solid var(--dash-border);
		font-size: 0.8rem;
		background: #fff;
	}
	
	.limit-input {
		width: 60px;
		text-align: center;
	}
</style>