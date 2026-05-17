<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const formatCurrency = (num: number) => {
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
	};

	const formatNumber = (num: number) => {
		return new Intl.NumberFormat('id-ID').format(num);
	};
</script>

<svelte:head>
	<title>Monitoring - Admin Dashboard</title>
</svelte:head>

<div class="dash-header">
	<div class="dash-header-content">
		<h1>📊 Monitoring Dashboard</h1>
		<p class="dash-header-sub">Statistik dan metrik platform secara real-time</p>
	</div>
	<div class="header-actions">
		<button class="btn btn-secondary btn-sm" onclick={() => window.location.reload()}>
			🔄 Refresh
		</button>
	</div>
</div>

<!-- Main Stats Grid -->
<div class="monitoring-grid">
	<!-- Users Stats -->
	<div class="monitor-card users-card">
		<div class="monitor-card-header">
			<div class="monitor-icon">👥</div>
			<div class="monitor-info">
				<h3>Total Users</h3>
				<span class="monitor-badge">Akun terdaftar</span>
			</div>
		</div>
		<div class="monitor-value">{formatNumber(data.monitoring.users.total)}</div>
		<div class="monitor-breakdown">
			<div class="breakdown-item breakdown-paid">
				<span class="breakdown-dot"></span>
				<span class="breakdown-label">Paid</span>
				<span class="breakdown-value">{formatNumber(data.monitoring.users.paid)}</span>
			</div>
			<div class="breakdown-item breakdown-trial">
				<span class="breakdown-dot"></span>
				<span class="breakdown-label">Trial</span>
				<span class="breakdown-value">{formatNumber(data.monitoring.users.onTrial)}</span>
			</div>
			<div class="breakdown-item breakdown-free">
				<span class="breakdown-dot"></span>
				<span class="breakdown-label">Free</span>
				<span class="breakdown-value">{formatNumber(data.monitoring.users.free)}</span>
			</div>
		</div>
		<div class="monitor-bar">
			<div class="bar-fill bar-paid" style="width: {data.monitoring.users.total > 0 ? (data.monitoring.users.paid / data.monitoring.users.total * 100) : 0}%"></div>
			<div class="bar-fill bar-trial" style="width: {data.monitoring.users.total > 0 ? (data.monitoring.users.onTrial / data.monitoring.users.total * 100) : 0}%"></div>
			<div class="bar-fill bar-free" style="width: {data.monitoring.users.total > 0 ? (data.monitoring.users.free / data.monitoring.users.total * 100) : 0}%"></div>
		</div>
	</div>

	<!-- Page Views -->
	<div class="monitor-card views-card">
		<div class="monitor-card-header">
			<div class="monitor-icon">👁️</div>
			<div class="monitor-info">
				<h3>Total Page Views</h3>
				<span class="monitor-badge">Pengunjung semua undangan</span>
			</div>
		</div>
		<div class="monitor-value">{formatNumber(data.monitoring.pageViews)}</div>
		<div class="monitor-subinfo">
			<span class="subinfo-icon">📈</span>
			<span>Rata-rata {data.monitoring.invitations.total > 0 ? Math.round(data.monitoring.pageViews / data.monitoring.invitations.total) : 0} views per undangan</span>
		</div>
	</div>

	<!-- Invitations -->
	<div class="monitor-card invitations-card">
		<div class="monitor-card-header">
			<div class="monitor-icon">💌</div>
			<div class="monitor-info">
				<h3>Total Invitations</h3>
				<span class="monitor-badge">Undangan yang dibuat</span>
			</div>
		</div>
		<div class="monitor-value">{formatNumber(data.monitoring.invitations.total)}</div>
		<div class="monitor-breakdown">
			<div class="breakdown-item breakdown-active">
				<span class="breakdown-dot"></span>
				<span class="breakdown-label">Published</span>
				<span class="breakdown-value">{formatNumber(data.monitoring.invitations.active)}</span>
			</div>
			<div class="breakdown-item breakdown-draft">
				<span class="breakdown-dot"></span>
				<span class="breakdown-label">Draft</span>
				<span class="breakdown-value">{formatNumber(data.monitoring.invitations.draft)}</span>
			</div>
		</div>
		<div class="monitor-progress">
			<div class="progress-label">
				<span>Engagement Rate</span>
				<span class="progress-value">{data.monitoring.engagementRate}%</span>
			</div>
			<div class="progress-bar">
				<div class="progress-fill" style="width: {data.monitoring.engagementRate}%"></div>
			</div>
		</div>
	</div>

	<!-- Revenue Estimate -->
	<div class="monitor-card revenue-card">
		<div class="monitor-card-header">
			<div class="monitor-icon">💰</div>
			<div class="monitor-info">
				<h3>Estimated Revenue</h3>
				<span class="monitor-badge">Dari pengguna premium</span>
			</div>
		</div>
		<div class="monitor-value">{formatCurrency(data.monitoring.revenue)}</div>
		<div class="monitor-subinfo">
				<span class="subinfo-icon">👤</span>
				<span>{formatNumber(data.monitoring.users.paid)} user × {formatCurrency(data.monitoring.premiumPrice)}</span>
			</div>
	</div>
</div>

<!-- Secondary Stats -->
<div class="secondary-grid">
	<div class="dash-card stat-card">
		<div class="stat-card-icon">🎨</div>
		<div class="stat-card-content">
			<h4>Templates</h4>
			<p class="stat-number">{formatNumber(data.monitoring.templates)}</p>
			<span class="stat-desc">Template tersedia</span>
		</div>
	</div>

	<div class="dash-card stat-card">
		<div class="stat-card-icon">🏷️</div>
		<div class="stat-card-content">
			<h4>Promo Codes</h4>
			<p class="stat-number">{formatNumber(data.monitoring.promoCodes.total)}</p>
			<span class="stat-desc">{formatNumber(data.monitoring.promoCodes.active)} aktif</span>
		</div>
	</div>

	<div class="dash-card stat-card">
		<div class="stat-card-icon">📋</div>
		<div class="stat-card-content">
			<h4>Audit Logs</h4>
			<p class="stat-number">{formatNumber(data.monitoring.auditLogs)}</p>
			<span class="stat-desc">Aktivitas sistem</span>
		</div>
	</div>
</div>

<!-- Quick Navigation -->
<div class="quick-nav">
	<h3>🔗 Navigasi Cepat</h3>
	<div class="quick-nav-grid">
		<a href="/admin/users" class="quick-nav-item">
			<span class="nav-icon">👥</span>
			<span class="nav-label">Kelola Users</span>
		</a>
		<a href="/admin/invitations" class="quick-nav-item">
			<span class="nav-icon">💌</span>
			<span class="nav-label">Kelola Undangan</span>
		</a>
		<a href="/admin/templates" class="quick-nav-item">
			<span class="nav-icon">🎨</span>
			<span class="nav-label">Kelola Templates</span>
		</a>
		<a href="/admin/audit" class="quick-nav-item">
			<span class="nav-icon">📋</span>
			<span class="nav-label">Lihat Audit Logs</span>
		</a>
		<a href="/admin/promo" class="quick-nav-item">
			<span class="nav-icon">🏷️</span>
			<span class="nav-label">Kelola Promo</span>
		</a>
		<a href="/api/monitoring" target="_blank" class="quick-nav-item">
			<span class="nav-icon">📡</span>
			<span class="nav-label">API Endpoint</span>
		</a>
	</div>
</div>

<style>
	.dash-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1rem;
	}
	.dash-header-content h1 {
		font-family: var(--font-serif);
		font-size: 1.8rem;
		margin-bottom: 0.25rem;
	}
	.dash-header-sub {
		color: var(--dash-text-muted);
		font-size: 0.9rem;
	}
	.header-actions {
		display: flex;
		gap: 0.5rem;
	}

	/* Main Grid */
	.monitoring-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	/* Monitor Card Base */
	.monitor-card {
		background: var(--dash-card-bg);
		border: 1px solid var(--dash-border);
		border-radius: 16px;
		padding: 1.5rem;
		transition: all 0.3s ease;
	}
	.monitor-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 32px rgba(0,0,0,0.25);
	}

	.monitor-card-header {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	.monitor-icon {
		font-size: 2.5rem;
		line-height: 1;
	}
	.monitor-info h3 {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--dash-text);
		margin-bottom: 0.25rem;
	}
	.monitor-badge {
		font-size: 0.75rem;
		color: var(--dash-text-muted);
	}

	.monitor-value {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--dash-text);
		margin-bottom: 1rem;
		line-height: 1;
	}

	.monitor-breakdown {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}
	.breakdown-item {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.8rem;
	}
	.breakdown-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}
	.breakdown-label {
		color: var(--dash-text-muted);
	}
	.breakdown-value {
		font-weight: 600;
		color: var(--dash-text);
	}

	/* Bar Colors */
	.breakdown-paid .breakdown-dot { background: #22c55e; }
	.breakdown-trial .breakdown-dot { background: #f59e0b; }
	.breakdown-free .breakdown-dot { background: #6b7280; }
	.breakdown-active .breakdown-dot { background: #22c55e; }
	.breakdown-draft .breakdown-dot { background: #6b7280; }

	.monitor-bar {
		height: 8px;
		background: var(--dash-border);
		border-radius: 4px;
		display: flex;
		overflow: hidden;
	}
	.bar-fill {
		height: 100%;
		transition: width 0.5s ease;
	}
	.bar-paid { background: #22c55e; }
	.bar-trial { background: #f59e0b; }
	.bar-free { background: #6b7280; }

	.monitor-subinfo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: var(--dash-text-muted);
		padding: 0.75rem;
		background: rgba(255,255,255,0.03);
		border-radius: 8px;
	}
	.subinfo-icon {
		font-size: 1rem;
	}

	/* Progress */
	.monitor-progress {
		margin-top: 1rem;
	}
	.progress-label {
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		color: var(--dash-text-muted);
		margin-bottom: 0.5rem;
	}
	.progress-value {
		font-weight: 600;
		color: #22c55e;
	}
	.progress-bar {
		height: 8px;
		background: var(--dash-border);
		border-radius: 4px;
		overflow: hidden;
	}
	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #22c55e, #16a34a);
		border-radius: 4px;
		transition: width 0.5s ease;
	}

	/* Card Specific Colors */
	.users-card { border-top: 3px solid #6c63ff; }
	.views-card { border-top: 3px solid #06b6d4; }
	.invitations-card { border-top: 3px solid #a78bfa; }
	.revenue-card { border-top: 3px solid #22c55e; }

	/* Secondary Grid */
	.secondary-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
	}
	.stat-card-icon {
		font-size: 2rem;
	}
	.stat-card-content h4 {
		font-size: 0.85rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}
	.stat-number {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--dash-text);
	}
	.stat-desc {
		font-size: 0.75rem;
		color: var(--dash-text-muted);
	}

	/* Quick Navigation */
	.quick-nav {
		margin-top: 2rem;
	}
	.quick-nav h3 {
		font-family: var(--font-serif);
		font-size: 1.2rem;
		margin-bottom: 1rem;
	}
	.quick-nav-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 0.75rem;
	}
	.quick-nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1.25rem;
		background: var(--dash-card-bg);
		border: 1px solid var(--dash-border);
		border-radius: 12px;
		text-decoration: none;
		color: var(--dash-text);
		transition: all 0.2s;
	}
	.quick-nav-item:hover {
		border-color: var(--dash-accent);
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(0,0,0,0.2);
	}
	.nav-icon {
		font-size: 2rem;
	}
	.nav-label {
		font-size: 0.85rem;
		font-weight: 500;
		text-align: center;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.monitoring-grid {
			grid-template-columns: 1fr;
		}
		.monitor-value {
			font-size: 2rem;
		}
	}
</style>
