<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const stats = $derived([
		{ label: 'Total Users', value: data.users.length, icon: '👥', color: '#6c63ff' },
		{ label: 'Total Undangan', value: data.invitations.length, icon: '💌', color: '#a78bfa' },
		{ label: 'Published', value: data.invitations.filter((i: any) => i.is_published).length, icon: '✅', color: '#27ae60' },
		{ label: 'Template', value: data.templates.length, icon: '🎨', color: '#e67e22' },
	]);

	const paidUsers = $derived(
		data.users.filter((u: { payment_status?: string }) => u.payment_status === 'paid').length
	);
	const pendingUsers = $derived(
		data.users.filter((u: { payment_status?: string }) => u.payment_status === 'pending')
	);
	const pendingPreview = $derived(pendingUsers.slice(0, 6));
</script>

<svelte:head>
	<title>Admin Dashboard - {data.appName}</title>
</svelte:head>

<div class="dash-header">
	<h1>📊 Admin Overview</h1>
</div>

<div class="dash-stats">
	{#each stats as stat, i}
		<div class="dash-stat" style="animation: fadeInUp 0.5s ease {i * 0.1}s both">
			<h3>{stat.icon} {stat.label}</h3>
			<div class="value">{stat.value}</div>
		</div>
	{/each}
</div>

<div class="dash-stats payment-overview">
	<div class="dash-stat payment-stat payment-stat--paid">
		<h3>✅ Sudah bayar</h3>
		<div class="value">{paidUsers}</div>
		<p class="stat-foot">Aktivasi premium (paid)</p>
	</div>
	<div class="dash-stat payment-stat payment-stat--pending">
		<h3>⏳ Proses pembayaran</h3>
		<div class="value">{pendingUsers.length}</div>
		<p class="stat-foot">Checkout / menunggu Midtrans</p>
	</div>
</div>

{#if pendingPreview.length > 0}
	<div class="dash-card pending-card">
		<div class="card-header">
			<h2>Menunggu pembayaran</h2>
			<a href="/admin/users?filter=pending" class="btn btn-secondary btn-sm">Kelola</a>
		</div>
		<table class="dash-table">
			<thead>
				<tr>
					<th>Username</th>
					<th>Email</th>
				</tr>
			</thead>
			<tbody>
				{#each pendingPreview as u}
					<tr>
						<td>{u.username}</td>
						<td>{u.email}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<div class="overview-grid">
	<!-- Recent Users -->
	<div class="dash-card">
		<div class="card-header">
			<h2>User Terbaru</h2>
			<div class="card-header-actions">
				<a href="/admin/users?filter=payments" class="btn btn-secondary btn-sm">Pembayaran</a>
				<a href="/admin/users" class="btn btn-secondary btn-sm">Semua</a>
			</div>
		</div>
		<table class="dash-table">
			<thead>
				<tr>
					<th>Username</th>
					<th>Email</th>
					<th>Role</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users.slice(0, 5) as user}
					<tr>
						<td>{user.username}</td>
						<td>{user.email}</td>
						<td><span class="badge {user.role === 'admin' ? 'badge-info' : 'badge-success'}">{user.role}</span></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Recent Invitations -->
	<div class="dash-card">
		<div class="card-header">
			<h2>Undangan Terbaru</h2>
			<a href="/admin/invitations" class="btn btn-secondary btn-sm">Lihat Semua</a>
		</div>
		<table class="dash-table">
			<thead>
				<tr>
					<th>Nama</th>
					<th>Slug</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{#each data.invitations.slice(0, 5) as inv}
					<tr>
						<td>{inv.bride_name} & {inv.groom_name}</td>
						<td>/{inv.slug}</td>
						<td><span class="badge {inv.is_published ? 'badge-success' : 'badge-warning'}">{inv.is_published ? 'Published' : 'Draft'}</span></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.payment-overview {
		margin-bottom: 1.5rem;
	}
	.payment-stat h3 {
		font-size: 0.9rem;
	}
	.payment-stat--paid {
		border-top: 3px solid #22c55e;
	}
	.payment-stat--pending {
		border-top: 3px solid #f59e0b;
	}
	.stat-foot {
		margin-top: 0.35rem;
		font-size: 0.75rem;
		color: var(--dash-text-muted);
	}
	.pending-card {
		margin-bottom: 1.5rem;
	}
	.card-header-actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}
	.card-header h2 {
		font-family: var(--font-serif);
		font-size: 1.2rem;
	}
	.overview-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 1.5rem;
	}
	@media (max-width: 900px) {
		.overview-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
