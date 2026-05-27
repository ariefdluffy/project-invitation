<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const stats = $derived([
		{ label: 'Total Undangan', value: data.invitations.length, icon: '💌' },
		{ label: 'Hadir', value: data.guestStats.attending, icon: '🙋‍♂️' },
		{ label: 'Tidak Hadir', value: data.guestStats.not_attending, icon: '🙅‍♂️' },
		{ label: 'Belum Respon', value: data.guestStats.no_response, icon: '⏳' },
	]);
</script>

<svelte:head>
	<title>Dashboard - {data.appName}</title>
</svelte:head>

<div class="dash-header">
	<div>
		<h1>Selamat Datang, {data.user.username}! 👋</h1>
		<p class="dash-header-sub">Kelola undangan pernikahanmu di sini</p>
	</div>
	<a href="/dashboard/create" class="btn btn-primary">
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
		Buat Undangan
	</a>
</div>

<!-- Analytics Overview -->
<div class="analytics-overview">
	<div class="analytics-card">
		<span class="analytics-icon">👁</span>
		<div class="analytics-info">
			<span class="analytics-value">{data.userStats?.totalViews || 0}</span>
			<span class="analytics-label">Total Views</span>
		</div>
	</div>
	<div class="analytics-card">
		<span class="analytics-icon">👤</span>
		<div class="analytics-info">
			<span class="analytics-value">{data.userStats?.totalUniqueVisitors || 0}</span>
			<span class="analytics-label">Unique Visitors</span>
		</div>
	</div>
	<div class="analytics-card">
		<span class="analytics-icon">💌</span>
		<div class="analytics-info">
			<span class="analytics-value">{data.userStats?.totalRsvp || 0}</span>
			<span class="analytics-label">RSVP Masuk</span>
		</div>
	</div>
</div>

{#if data.user.role !== 'admin' && data.user.has_access !== 1}
	<div class="dash-banner warning" style="animation: slideInDown 0.5s ease">
		<div class="banner-content">
			<span class="banner-icon">⚠️</span>
			<div class="banner-text">
				<strong>Akun Belum Aktif</strong>
				<p>Anda belum memiliki akses untuk membuat undangan. Silakan lakukan aktivasi akun Anda.</p>
			</div>
		</div>
		<a href="/dashboard/billing" class="btn btn-primary btn-sm">Aktivasi Akun</a>
	</div>
{/if}

<!-- Stats -->
<div class="dash-stats">
	{#each stats as stat, i}
		<div class="dash-stat" style="animation: fadeInUp 0.5s ease {i * 0.1}s both">
			<h3>{stat.icon} {stat.label}</h3>
			<div class="value">{stat.value}</div>
		</div>
	{/each}
</div>

<!-- Recent Invitations -->
<div class="dash-card">
	<div class="card-header">
		<h2>Undangan Terbaru</h2>
		{#if data.invitations.length > 0}
			<a href="/dashboard/invitations" class="btn btn-secondary btn-sm">Lihat Semua</a>
		{/if}
	</div>

	{#if data.invitations.length === 0}
		<div class="empty-state">
			<div class="empty-icon">💍</div>
			<h3>Belum ada undangan</h3>
			<p>Mulai buat undangan pernikahan digitalmu sekarang!</p>
			<a href="/dashboard/create" class="btn btn-primary">Buat Undangan Pertama</a>
		</div>
	{:else}
		<div class="invitation-list">
			{#each data.invitations.slice(0, 5) as inv}
				<div class="invitation-item">
					<div class="inv-info">
						<h4>{inv.bride_name} & {inv.groom_name}</h4>
						<span class="inv-slug">/{inv.slug}</span>
					</div>
					<div class="inv-meta">
						<span class="badge {inv.is_published ? 'badge-success' : 'badge-warning'}">
							{inv.is_published ? 'Published' : 'Draft'}
						</span>
						<a href="/dashboard/invitations/{inv.id}" class="btn btn-secondary btn-sm">Edit</a>
						{#if inv.is_published}
							<a href="/invitation/{inv.slug}" target="_blank" class="btn btn-secondary btn-sm">Preview</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.analytics-overview {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-bottom: 2rem;
	}
	.analytics-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
		background: var(--dash-card-bg, #1a1a2e);
		border: 1px solid var(--dash-border, rgba(255,255,255,0.08));
		border-radius: 12px;
	}
	.analytics-icon {
		font-size: 2rem;
	}
	.analytics-info {
		display: flex;
		flex-direction: column;
	}
	.analytics-value {
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1.2;
	}
	.analytics-label {
		font-size: 0.8rem;
		color: var(--dash-text-muted, #888);
	}
	@media (max-width: 600px) {
		.analytics-overview {
			grid-template-columns: 1fr;
		}
	}
	.dash-header-sub {
		color: var(--dash-text-muted);
		font-size: 0.95rem;
		margin-top: 0.25rem;
	}
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}
	.card-header h2 {
		font-family: var(--font-serif);
		font-size: 1.3rem;
	}
	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
	}
	.empty-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}
	.empty-state h3 {
		font-family: var(--font-serif);
		font-size: 1.3rem;
		margin-bottom: 0.5rem;
	}
	.empty-state p {
		color: var(--dash-text-muted);
		margin-bottom: 1.5rem;
	}
	.invitation-list {
		display: flex;
		flex-direction: column;
	}
	.invitation-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 0;
		border-bottom: 1px solid var(--dash-border);
		gap: 1rem;
	}
	.invitation-item:last-child {
		border-bottom: none;
	}
	.inv-info h4 {
		font-family: var(--font-serif);
		font-size: 1.05rem;
		margin-bottom: 0.25rem;
	}
	.inv-slug {
		color: var(--dash-text-muted);
		font-size: 0.85rem;
	}
	.inv-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	@media (max-width: 600px) {
		.invitation-item {
			flex-direction: column;
			align-items: flex-start;
		}
		.inv-meta {
			width: 100%;
		}
	}

	.dash-banner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 1.5rem;
		border-radius: 12px;
		margin-bottom: 2rem;
		gap: 1.5rem;
	}

	.dash-banner.warning {
		background: #fff7ed;
		border: 1px solid #ffedd5;
		color: #9a3412;
	}

	.banner-content {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.banner-icon {
		font-size: 1.5rem;
	}

	.banner-text strong {
		display: block;
		margin-bottom: 0.25rem;
	}

	.banner-text p {
		font-size: 0.9rem;
		opacity: 0.9;
	}

	@keyframes slideInDown {
		from { transform: translateY(-20px); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}
</style>
