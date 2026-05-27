<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Undangan - Admin {data.appName}</title></svelte:head>

<div class="dash-header">
	<h1>💌 Semua Undangan</h1>
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
							{/if}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.action-btns {
		display: flex;
		gap: 0.3rem;
	}
</style>
