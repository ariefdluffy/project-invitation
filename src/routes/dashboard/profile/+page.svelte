<script lang="ts">
	import type { PageData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/toast.svelte';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	const updatePasswordEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				const d = result.data as { message?: string } | undefined;
				if (d?.message) {
					toast.success(d.message);
					// Clear form fields on success
					currentPassword = '';
					newPassword = '';
					confirmPassword = '';
				}
			} else if (result.type === 'failure') {
				const d = result.data as { error?: string } | undefined;
				if (d?.error) toast.error(d.error);
			} else if (result.type === 'error') {
				toast.error('Terjadi kesalahan server.');
			}
		};
	};
</script>

<svelte:head><title>My Profile - Dashboard</title></svelte:head>

<div class="dash-header">
	<div>
		<h1>👤 My Profile</h1>
		<p class="dash-header-sub">Kelola informasi akun Anda dan ubah password.</p>
		</div>
</div>

<div class="profile-grid">
	<div class="dash-card info-account-card">
		<h3 class="section-title">Informasi Akun</h3>
		<div class="info-list">
			<div class="info-item">
				<span class="info-label">Username:</span>
				<span class="info-value">{data.user?.username || '-'}</span>
			</div>
			<div class="info-item">
				<span class="info-label">Email:</span>
				<span class="info-value">{data.user?.email || '-'}</span>
			</div>
			<div class="info-item">
				<span class="info-label">Status Pembayaran:</span>
				<span class="info-value badge {data.user?.payment_status}">{data.user?.payment_status || '-'}</span>
			</div>
			<div class="info-item">
				<span class="info-label">Limit Undangan:</span>
				<span class="info-value">{data.user?.invitation_limit || '-'}</span>
			</div>
			<div class="info-item">
				<span class="info-label">Limit Tamu:</span>
				<span class="info-value">{data.user?.guest_limit || '-'}</span>
			</div>
			<div class="info-item">
				<span class="info-label">Kuota Template:</span>
				<span class="info-value">{data.user?.template_quota || '-'}</span>
			</div>
		</div>
	</div>

	<div class="dash-card">
		<h3 class="section-title">Ubah Password</h3>
		<form method="POST" action="?/updatePassword" use:enhance={updatePasswordEnhance}>
			<div class="form-group">
				<label for="currentPassword">Password Saat Ini</label>
				<input
					type="password"
					id="currentPassword"
					name="currentPassword"
					class="form-control"
					bind:value={currentPassword}
					autocomplete="current-password"
					required
				/>
			</div>
			<div class="form-group">
				<label for="newPassword">Password Baru</label>
				<input
					type="password"
					id="newPassword"
					name="newPassword"
					class="form-control"
					bind:value={newPassword}
					autocomplete="new-password"
					required
				/>
			</div>
			<div class="form-group">
				<label for="confirmPassword">Konfirmasi Password Baru</label>
				<input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					class="form-control"
					bind:value={confirmPassword}
					autocomplete="new-password"
					required
				/>
			</div>
			<button type="submit" class="btn btn-primary mt-4">Ubah Password</button>
		</form>
	</div>
</div>

<style>
	.dash-header-sub {
		color: var(--dash-text-muted);
		font-size: 0.95rem;
		margin-top: 0.25rem;
	}

	.profile-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		max-width: 900px;
	}

	@media (min-width: 768px) {
		.profile-grid {
			grid-template-columns: 1.2fr 1fr;
		}
	}

	.section-title {
		margin-bottom: 2rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--dash-border);
		font-family: var(--font-serif);
	}

	.info-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		padding-bottom: 0.75rem;
		border-bottom: 1px dashed var(--dash-border);
		font-size: 0.95rem;
	}

	.info-item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.info-label {
		font-weight: 600;
		color: var(--dash-text-strong);
	}

	.info-value {
		color: var(--dash-text);
	}

	.info-value.badge {
		padding: 0.25rem 0.6rem;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 600;
		border: 1px solid transparent;
		text-transform: capitalize;
	}

	.info-value.badge.unpaid {
		background: #fee2e2;
		color: #ef4444;
	}
	.info-value.badge.paid {
		background: #dcfce7;
		color: #22c55e;
	}
	.info-value.badge.pending {
		background: #fef3c7;
		color: #b45309;
	}
	.info-value.badge.inactive {
		background: #e2e8f0;
		color: #475569;
	}

	.form-group {
		margin-bottom: 1.25rem; 
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: var(--dash-text-strong);
	}

	.form-control {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 1px solid var(--dash-border);
		border-radius: var(--radius-md);
		background-color: var(--dash-input-bg);
		color: var(--dash-text);
		font-size: 1rem;
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.form-control:focus {
		border-color: var(--accent);
		outline: none;
		box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.2);
	}

	.btn-primary {
		background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: var(--radius-md);
		font-weight: 600;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
	}

	.btn-primary:hover {
		box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
		transform: translateY(-1px);
	}
</style>