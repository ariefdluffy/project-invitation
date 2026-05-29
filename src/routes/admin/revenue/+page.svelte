<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const revenue = data.revenue;
	const monthlyData = data.monthlyData;
	const byType = data.byType;
	const recent = data.recentTransactions;

	const maxMonthly = $derived(Math.max(...monthlyData.map((m: any) => m.total), 1));
	const successRate = $derived(
		revenue && revenue.successCount + revenue.failCount > 0
			? Math.round((revenue.successCount / (revenue.successCount + revenue.failCount)) * 100)
			: 0
	);

	function fmtCurrency(n: number) {
		return 'Rp ' + n.toLocaleString('id-ID');
	}

	function monthLabel(ym: string) {
		const [y, m] = ym.split('-');
		const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
		return months[parseInt(m) - 1] + ' ' + y;
	}
</script>

<svelte:head><title>Revenue Dashboard - Admin</title></svelte:head>

<div class="dash-header"><h1>💰 Revenue Dashboard</h1></div>

{#if revenue}
	<div class="stats-row">
		<div class="dash-card stat-card"><span class="stat-label">Total Revenue</span><span class="stat-value">{fmtCurrency(revenue.totalRevenue)}</span></div>
		<div class="dash-card stat-card"><span class="stat-label">Total Transaksi</span><span class="stat-value">{revenue.totalTransactions}</span></div>
		<div class="dash-card stat-card"><span class="stat-label">Success Rate</span><span class="stat-value" style="color:{successRate >= 80 ? '#22c55e' : '#f59e0b'}">{successRate}%</span></div>
		<div class="dash-card stat-card"><span class="stat-label">Gagal/Dibatalkan</span><span class="stat-value" style="color:#ef4444">{revenue.failCount}</span></div>
	</div>

	<!-- Monthly Revenue Chart -->
	<div class="dash-card" style="margin-top:1.5rem">
		<h3 style="margin-bottom:1rem">📈 Pendapatan 6 Bulan Terakhir</h3>
		{#if monthlyData.length === 0}
			<p class="muted">Belum ada data</p>
		{:else}
			<div class="chart">
				{#each monthlyData as row}
					<div class="chart-col">
						<div class="chart-bar-wrap">
							<div class="chart-bar" style="height:{(row.total / maxMonthly) * 100}%">
								<span class="chart-bar-label">{fmtCurrency(row.total)}</span>
							</div>
						</div>
						<span class="chart-label">{monthLabel(row.month)}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Revenue by Type -->
	<div class="dash-card" style="margin-top:1.5rem">
		<h3 style="margin-bottom:1rem">📊 Revenue by Tipe</h3>
		{#if byType.length === 0}
			<p class="muted">Belum ada data</p>
		{:else}
			<table class="dash-table">
				<thead><tr><th>Tipe</th><th>Jumlah Transaksi</th><th>Total Revenue</th></tr></thead>
				<tbody>
					{#each byType as row}
						<tr>
							<td><span class="badge">{row.type}</span></td>
							<td>{row.count}</td>
							<td>{fmtCurrency(row.total)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<!-- Recent Transactions -->
	<div class="dash-card" style="margin-top:1.5rem">
		<h3 style="margin-bottom:1rem">🕐 10 Transaksi Terakhir</h3>
		{#if recent.length === 0}
			<p class="muted">Belum ada transaksi</p>
		{:else}
			<table class="dash-table">
				<thead><tr><th>Order ID</th><th>Email</th><th>Tipe</th><th>Jumlah</th><th>Status</th><th>Tanggal</th></tr></thead>
				<tbody>
					{#each recent as tx}
						<tr>
							<td style="font-family:monospace;font-size:0.8rem">{tx.order_id}</td>
							<td>{tx.email}</td>
							<td>{tx.type}</td>
							<td>{fmtCurrency(tx.amount)}</td>
							<td><span class="badge badge-{tx.status}">{tx.status}</span></td>
							<td>{new Date(tx.created_at).toLocaleDateString('id-ID')}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
{:else}
	<div class="dash-card"><p>Data tidak tersedia</p></div>
{/if}

<style>
	.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
	.stat-card { text-align: center; }
	.stat-label { display: block; font-size: 0.8rem; color: var(--dash-text-muted); margin-bottom: 0.25rem; }
	.stat-value { font-size: 1.8rem; font-weight: 700; font-family: var(--font-serif); }
	.muted { color: var(--dash-text-muted); }
	.chart { display: flex; align-items: flex-end; gap: 1rem; height: 200px; padding-top: 2rem; }
	.chart-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
	.chart-bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
	.chart-bar { width: 100%; background: linear-gradient(135deg, var(--dash-accent), var(--color-primary-200)); border-radius: 4px 4px 0 0; min-height: 4px; position: relative; transition: height 0.5s ease; }
	.chart-bar-label { position: absolute; top: -1.5rem; left: 50%; transform: translateX(-50%); font-size: 0.65rem; font-weight: 600; white-space: nowrap; }
	.chart-label { font-size: 0.75rem; margin-top: 0.25rem; color: var(--dash-text-muted); text-align: center; }
	.badge-paid { background: #dcfce7; color: #22c55e; }
	.badge-success { background: #dcfce7; color: #22c55e; }
	.badge-failed { background: #fee2e2; color: #ef4444; }
	.badge-cancelled { background: #e2e8f0; color: #475569; }
	.badge-pending { background: #fef3c7; color: #b45309; }
</style>
