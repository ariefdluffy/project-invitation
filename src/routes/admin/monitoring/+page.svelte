<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	// ─── Format helpers ────────────────────────────────────────────────
	const formatCurrency = (num: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

	const formatNumber = (num: number) =>
		new Intl.NumberFormat('id-ID').format(num);

	// ─── Health check ──────────────────────────────────────────────────
	let healthData = $state<{ status: string; database: string; responseTime: number; uptime: number } | null>(null);
	let healthError = $state<string | null>(null);

	async function checkHealth() {
		healthError = null;
		try {
			const res = await fetch('/api/health');
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			healthData = await res.json();
		} catch {
			healthError = 'Gagal hubungi /api/health';
			healthData = null;
		}
	}

	onMount(() => { checkHealth(); });

	function formatUptime(seconds: number): string {
		const d = Math.floor(seconds / 86400);
		const h = Math.floor((seconds % 86400) / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const parts: string[] = [];
		if (d > 0) parts.push(`${d}h`);
		if (h > 0) parts.push(`${h}j`);
		parts.push(`${m}m`);
		return parts.join(' ');
	}
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
		<!-- Health indicator -->
		{#if healthData}
			<span class="health-badge health-{healthData.status}">
				<span class="health-dot"></span>
				{healthData.status === 'healthy' ? 'Sistem Sehat' : 'Degradasi'}
			</span>
		{:else if healthError}
			<span class="health-badge health-error">
				<span class="health-dot"></span>
				{healthError}
			</span>
		{/if}
		<button class="btn btn-secondary btn-sm" onclick={() => { checkHealth(); }}>
			🔄 Refresh
		</button>
	</div>
</div>

<!-- Health row -->
{#if healthData}
	<div class="health-row">
		<div class="health-item">
			<span class="health-label">Uptime</span>
			<span class="health-val">{formatUptime(healthData.uptime)}</span>
		</div>
		<div class="health-item">
			<span class="health-label">Database</span>
			<span class="health-val health-db-{healthData.database}">
				<span class="health-dot-sm"></span>
				{healthData.database === 'connected' ? 'Terhubung' : 'Putus'}
			</span>
		</div>
		<div class="health-item">
			<span class="health-label">Response Time</span>
			<span class="health-val">{healthData.responseTime}ms</span>
		</div>
	</div>
{/if}

<!-- Main Stats Grid -->
<div class="monitoring-grid">
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

	<div class="monitor-card views-card">
		<div class="monitor-card-header">
			<div class="monitor-icon">
				<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><path d="M12 5v2M12 17v2M5 12H3M21 12h-2"/></svg>
			</div>
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
				<span>{formatNumber(data.monitoring.users.paid)} user premium</span>
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
	</div>
</div>

<style>
	.dash-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-xl);
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	.dash-header-content h1 {
		font-family: var(--font-serif);
		font-size: 1.5rem;
	}
	.dash-header-sub {
		color: var(--dash-text-muted);
		font-size: 0.9rem;
		margin-top: 0.2rem;
	}
	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		flex-wrap: wrap;
	}

	/* ─── Health badge & row ─────────────────────────────────────────── */
	.health-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.72rem;
		font-weight: 700;
		padding: 0.3rem 0.65rem;
		border-radius: 999px;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.health-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: currentColor;
		box-shadow: 0 0 8px currentColor;
	}
	.health-healthy {
		background: rgba(34,197,94,0.12);
		color: #4ade80;
	}
	.health-degraded {
		background: rgba(243,156,18,0.12);
		color: #fbbf24;
	}
	.health-error {
		background: rgba(231,76,60,0.12);
		color: #f87171;
	}

	.health-row {
		display: flex;
		gap: 1rem;
		margin-bottom: var(--space-lg);
		flex-wrap: wrap;
	}
	.health-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.9rem;
		background: var(--dash-surface);
		border: 1px solid var(--dash-border);
		border-radius: var(--radius-sm);
	}
	.health-label {
		font-size: 0.72rem;
		color: var(--dash-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		font-weight: 600;
	}
	.health-val {
		font-size: 0.85rem;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}
	.health-dot-sm {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
	}
	.health-db-connected { color: #22c55e; }
	.health-db-disconnected { color: #f87171; }

	/* ─── Main grid ──────────────────────────────────────────────────── */
	.monitoring-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-bottom: 1rem;
	}
	@media (max-width: 1100px) {
		.monitoring-grid { grid-template-columns: repeat(2, 1fr); }
	}
	@media (max-width: 600px) {
		.monitoring-grid { grid-template-columns: 1fr; }
	}

	.monitor-card {
		background: var(--dash-surface);
		border: 1px solid var(--dash-border);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		transition: all var(--transition-base);
	}
	.monitor-card:hover {
		border-color: rgba(108,99,255,0.3);
		box-shadow: 0 8px 32px rgba(0,0,0,0.2);
	}

	.monitor-card-header {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		margin-bottom: 0.75rem;
	}
	.monitor-icon {
		font-size: 1.4rem;
		flex-shrink: 0;
	}
	.monitor-info h3 {
		font-size: 0.85rem;
		font-weight: 600;
		margin: 0;
		color: var(--dash-text);
	}
	.monitor-badge {
		font-size: 0.65rem;
		color: var(--dash-text-muted);
	}

	.monitor-value {
		font-family: var(--font-serif);
		font-size: 2.2rem;
		font-weight: 700;
		line-height: 1.1;
		margin-bottom: 0.6rem;
	}

	.monitor-breakdown {
		display: flex;
		gap: 1rem;
		margin-bottom: 0.6rem;
	}
	.breakdown-item {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.8rem;
	}
	.breakdown-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
	}
	.breakdown-label {
		color: var(--dash-text-muted);
	}
	.breakdown-value {
		font-weight: 700;
		color: var(--dash-text);
	}
	.breakdown-paid .breakdown-dot { background: #22c55e; }
	.breakdown-trial .breakdown-dot { background: #a78bfa; }
	.breakdown-free .breakdown-dot { background: #64748b; }
	.breakdown-active .breakdown-dot { background: #22c55e; }
	.breakdown-draft .breakdown-dot { background: #f59e0b; }

	.monitor-bar {
		display: flex;
		height: 6px;
		border-radius: 999px;
		overflow: hidden;
		background: rgba(255,255,255,0.05);
		gap: 1px;
	}
	.bar-fill {
		height: 100%;
		transition: width 0.5s ease;
	}
	.bar-paid { background: var(--dash-gradient-green); }
	.bar-trial { background: var(--dash-gradient); }
	.bar-free { background: #64748b; }

	.monitor-subinfo {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.8rem;
		color: var(--dash-text-muted);
	}
	.subinfo-icon { font-size: 1rem; }

	.monitor-progress {
		margin-top: 0.5rem;
	}
	.progress-label {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: var(--dash-text-muted);
		margin-bottom: 0.3rem;
	}
	.progress-value {
		font-weight: 700;
		color: var(--dash-accent);
	}
	.progress-bar {
		height: 5px;
		background: rgba(255,255,255,0.06);
		border-radius: 999px;
		overflow: hidden;
	}
	.progress-fill {
		height: 100%;
		background: var(--dash-gradient);
		border-radius: 999px;
		transition: width 0.5s ease;
	}

	.users-card { border-left: 3px solid #22c55e; }
	.views-card { border-left: 3px solid #06b6d4; }
	.invitations-card { border-left: 3px solid #a78bfa; }
	.revenue-card { border-left: 3px solid #f59e0b; }

	/* ─── Secondary grid ─────────────────────────────────────────────── */
	.secondary-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-bottom: 1rem;
	}
	@media (max-width: 700px) {
		.secondary-grid { grid-template-columns: 1fr; }
	}
	.stat-card {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		padding: 1rem 1.25rem;
	}
	.stat-card-icon {
		font-size: 1.8rem;
		flex-shrink: 0;
	}
	.stat-card-content h4 {
		font-size: 0.78rem;
		color: var(--dash-text-muted);
		margin: 0 0 0.15rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.stat-number {
		font-family: var(--font-serif);
		font-size: 1.4rem;
		font-weight: 700;
		margin: 0;
	}
	.stat-desc {
		font-size: 0.72rem;
		color: var(--dash-text-muted);
	}

	/* ─── Quick Nav ──────────────────────────────────────────────────── */
	.quick-nav {
		margin-top: 0.5rem;
	}
	.quick-nav h3 {
		font-family: var(--font-serif);
		font-size: 1rem;
		margin-bottom: 0.75rem;
	}
	.quick-nav-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 0.65rem;
	}
	.quick-nav-item {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0.9rem 1rem;
		background: var(--dash-surface);
		border: 1px solid var(--dash-border);
		border-radius: var(--radius-sm);
		transition: all var(--transition-base);
	}
	.quick-nav-item:hover {
		border-color: var(--dash-accent);
		background: rgba(108,99,255,0.06);
		transform: translateY(-2px);
	}
	.nav-icon {
		font-size: 1.3rem;
	}
	.nav-label {
		font-size: 0.85rem;
		font-weight: 600;
	}
</style>
