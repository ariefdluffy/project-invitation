<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/toast.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showCreateForm = $state(false);

	const handleFormEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				const d = result.data as { message?: string } | undefined;
				if (d?.message) toast.success(d.message);
				showCreateForm = false;
			} else if (result.type === 'failure') {
				const d = result.data as { error?: string } | undefined;
				if (d?.error) toast.error(d.error);
			} else if (result.type === 'error') {
				toast.error('Terjadi kesalahan server.');
			}
		};
	};
</script>

<svelte:head><title>Promo Codes - Admin</title></svelte:head>

<div class="dash-header">
	<div>
		<h1>🏷️ Promo Codes</h1>
		<p class="dash-header-sub">
			Kelola kode promo untuk diskon undangan.
		</p>
	</div>
	<button class="btn btn-primary" onclick={() => showCreateForm = !showCreateForm}>
		{showCreateForm ? '✕ Tutup' : '+ Tambah Promo'}
	</button>
</div>

{#if showCreateForm}
	<div class="dash-card promo-form-card">
		<h2 class="form-card-title">Buat Kode Promo Baru</h2>

		{#if form?.error}
			<div class="error-message">{form.error}</div>
		{/if}

		<form method="POST" action="?/create" use:enhance={handleFormEnhance}>
			<div class="form-row">
				<div class="form-group">
					<label for="code">Kode Promo</label>
					<input type="text" id="code" name="code" class="form-control" placeholder="cth: WEDDING50" required />
				</div>
				<div class="form-group">
					<label for="discount_percent">Diskon (%)</label>
					<input type="number" id="discount_percent" name="discount_percent" class="form-control" placeholder="0" min="0" max="100" />
				</div>
				<div class="form-group">
					<label for="discount_fixed">Diskon (Rp)</label>
					<input type="number" id="discount_fixed" name="discount_fixed" class="form-control" placeholder="0" min="0" />
				</div>
			</div>
			<div class="form-row">
				<div class="form-group">
					<label for="max_uses">Maks Pemakaian</label>
					<input type="number" id="max_uses" name="max_uses" class="form-control" placeholder="0 = tak terbatas" min="0" />
				</div>
				<div class="form-group">
					<label for="expires_at">Berlaku Sampai</label>
					<input type="date" id="expires_at" name="expires_at" class="form-control" />
				</div>
			</div>
			<div class="form-actions">
				<button type="button" class="btn btn-secondary" onclick={() => showCreateForm = false}>Batal</button>
				<button type="submit" class="btn btn-primary">Simpan Promo</button>
			</div>
		</form>
	</div>
{/if}

<div class="dash-card">
	<table class="dash-table">
		<thead>
			<tr>
				<th>Kode</th>
				<th>Diskon</th>
				<th>Pemakaian</th>
				<th>Berlaku Sampai</th>
				<th>Status</th>
				<th>Aksi</th>
			</tr>
		</thead>
		<tbody>
			{#each data.promos as promo}
				<tr>
					<td>
						<strong>{promo.code}</strong>
					</td>
					<td>
						{#if promo.discount_percent > 0}
							<span class="badge badge-success">{promo.discount_percent}%</span>
						{/if}
						{#if promo.discount_fixed > 0}
							<span class="badge badge-info">Rp {promo.discount_fixed.toLocaleString('id-ID')}</span>
						{/if}
						{#if promo.discount_percent === 0 && promo.discount_fixed === 0}
							<span class="badge badge-warning">0</span>
						{/if}
					</td>
					<td>
						{promo.used_count}{#if promo.max_uses > 0}/{promo.max_uses}{:else}/∞{/if}
					</td>
					<td>
						{promo.expires_at ? new Date(promo.expires_at).toLocaleDateString('id-ID') : 'Tidak ada batas'}
					</td>
					<td>
						{#if !promo.is_active}
							<span class="badge badge-danger">Nonaktif</span>
						{:else if promo.expires_at && new Date(promo.expires_at) < new Date()}
							<span class="badge badge-danger">Kadaluarsa</span>
						{:else if promo.max_uses > 0 && promo.used_count >= promo.max_uses}
							<span class="badge badge-warning">Habis</span>
						{:else}
							<span class="badge badge-success">Aktif</span>
						{/if}
					</td>
					<td>
						<form method="POST" action="?/delete" use:enhance={handleFormEnhance}>
							<input type="hidden" name="id" value={promo.id} />
							<button type="submit" class="btn-icon btn-danger" title="Hapus Promo">
								🗑️
							</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	{#if data.promos.length === 0}
		<p class="empty-state">Belum ada kode promo. Klik "Tambah Promo" untuk membuat.</p>
	{/if}
</div>

<style>
	.dash-header-sub {
		color: var(--dash-text-muted);
		font-size: 0.95rem;
		margin-top: 0.25rem;
		max-width: 36rem;
	}

	.promo-form-card {
		margin-bottom: 1.5rem;
	}

	.form-card-title {
		font-family: var(--font-serif);
		font-size: 1.25rem;
		margin-bottom: 1.25rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.error-message {
		background: rgba(231, 76, 60, 0.1);
		color: var(--color-danger);
		padding: 0.75rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		border: 1px solid rgba(231, 76, 60, 0.3);
	}

	.empty-state {
		text-align: center;
		padding: 2rem;
		color: var(--dash-text-muted);
		font-size: 0.9rem;
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
</style>
