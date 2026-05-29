<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/toast.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showDeleteModal = $state(false);
	let invToDelete = $state<any>(null);

	function openDeleteModal(inv: any) {
		invToDelete = inv;
		showDeleteModal = true;
	}

	const handleFormEnhance = () => {
		return async ({ result, update }: any) => {
			await update();
			if (result.type === 'success') {
				const d = result.data as { message?: string } | undefined;
				if (d?.message) toast.success(d.message);
				showDeleteModal = false;
			} else if (result.type === 'failure') {
				const d = result.data as { error?: string } | undefined;
				if (d?.error) toast.error(d.error);
			}
		};
	};
</script>

<svelte:head><title>Undangan - Admin {data.appName}</title></svelte:head>

<div class="dash-header">
	<h1>💌 Semua Undangan</h1>
	{#if data.pagination}
		<p class="dash-header-sub">Total {data.pagination.totalInvitations} undangan</p>
	{/if}
</div>

<div class="dash-card">
	<table class="dash-table">
		<thead>
			<tr>
				<th>Mempelai</th>
				<th>Slug</th>
				<th>Status</th>
				<th>Tanggal Acara</th>
				<th>Aksi</th>
			</tr>
		</thead>
		<tbody>
			{#each data.invitations as inv}
				<tr>
					<td><strong>{inv.bride_name} & {inv.groom_name}</strong></td>
					<td>/{inv.slug}</td>
					<td><span class="badge {inv.is_published ? 'badge-success' : 'badge-warning'}">{inv.is_published ? 'Published' : 'Draft'}</span></td>
					<td>{inv.akad_date ? new Date(inv.akad_date).toLocaleDateString('id-ID') : '-'}</td>
					<td>
						<div class="action-btns">
							<a href="/dashboard/invitations/{inv.id}" class="btn btn-secondary btn-sm">Edit</a>
							{#if inv.is_published}
								<a href="/invitation/{inv.slug}" target="_blank" class="btn btn-secondary btn-sm">View</a>
								<form method="POST" action="?/unpublish" use:enhance={handleFormEnhance} style="display:inline">
									<input type="hidden" name="id" value={inv.id} />
									<button type="submit" class="btn btn-secondary btn-sm">Unpublish</button>
								</form>
							{/if}
							<button type="button" class="btn btn-danger btn-sm" onclick={() => openDeleteModal(inv)}>Hapus</button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

{#if data.pagination && data.pagination.totalInvitationPages > 1}
	<div class="pagination">
		{#if data.pagination.page > 1}
			<a href="/admin/invitations?page={data.pagination.page - 1}" class="btn btn-secondary btn-sm">← Prev</a>
		{/if}
		<span class="pagination-info">Halaman {data.pagination.page} dari {data.pagination.totalInvitationPages}</span>
		{#if data.pagination.page < data.pagination.totalInvitationPages}
			<a href="/admin/invitations?page={data.pagination.page + 1}" class="btn btn-secondary btn-sm">Next →</a>
		{/if}
	</div>
{/if}

<!-- Modal Hapus -->
{#if showDeleteModal && invToDelete}
	<div
		class="modal-overlay"
		role="button"
		tabindex="0"
		onclick={(e) => { if (e.target === e.currentTarget) showDeleteModal = false; }}
		onkeydown={(e) => { if (e.key === 'Escape') showDeleteModal = false; }}
	>
		<div class="modal-content" role="dialog" aria-modal="true">
			<div class="modal-header">
				<h2>Hapus Undangan</h2>
				<button class="btn-close" onclick={() => showDeleteModal = false}>✕</button>
			</div>
			<p>Yakin hapus undangan <strong>{invToDelete.bride_name} & {invToDelete.groom_name}</strong>?</p>
			<p style="margin-top: 0.5rem; color: var(--color-danger);">Tindakan ini tidak dapat dibatalkan. Semua tamu dan RSVP akan ikut terhapus.</p>
			<form method="POST" action="?/delete" use:enhance={handleFormEnhance}>
				<input type="hidden" name="id" value={invToDelete.id} />
				<div class="modal-actions">
					<button type="button" class="btn btn-secondary" onclick={() => showDeleteModal = false}>Batal</button>
					<button type="submit" class="btn btn-danger">Ya, Hapus</button>
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
	}
	.action-btns {
		display: flex;
		gap: 0.3rem;
		flex-wrap: wrap;
	}
	.pagination {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-top: 1.5rem;
		padding: 1rem 0;
	}
	.pagination-info {
		font-size: 0.85rem;
		color: var(--dash-text-muted);
	}
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}
	.modal-content {
		background: var(--dash-card-bg, #1a1a2e);
		border-radius: 12px;
		padding: 2rem;
		max-width: 480px;
		width: 90%;
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
</style>
