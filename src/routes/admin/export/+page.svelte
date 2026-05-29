<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	function downloadCSV(action: string) {
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = `?/${action}`;
		form.style.display = 'none';
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	}
</script>

<svelte:head><title>Export Data - Admin {data.appName}</title></svelte:head>

<div class="dash-header">
	<h1>📄 Export Data</h1>
</div>

<div class="export-grid">
	<div class="dash-card export-card">
		<div class="export-icon">👥</div>
		<h3>Export Users</h3>
		<p>Semua user terdaftar: username, email, role, status bayar, limit, tanggal daftar</p>
		<button class="btn btn-primary" onclick={() => downloadCSV('exportUsers')}>
			⬇ Download Users CSV
		</button>
	</div>

	<div class="dash-card export-card">
		<div class="export-icon">💌</div>
		<h3>Export Undangan</h3>
		<p>Semua undangan: slug, nama pengantin, status, tanggal acara, pemilik</p>
		<button class="btn btn-primary" onclick={() => downloadCSV('exportInvitations')}>
			⬇ Download Invitations CSV
		</button>
	</div>

	<div class="dash-card export-card">
		<div class="export-icon">💳</div>
		<h3>Export Pembayaran</h3>
		<p>Semua transaksi: order ID, tipe, jumlah, status, tanggal, email user</p>
		<button class="btn btn-primary" onclick={() => downloadCSV('exportPayments')}>
			⬇ Download Payments CSV
		</button>
	</div>
</div>

<style>
	.export-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}
	.export-card {
		text-align: center;
		padding: 2rem;
	}
	.export-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}
	.export-card h3 {
		font-family: var(--font-serif);
		margin-bottom: 0.75rem;
	}
	.export-card p {
		color: var(--dash-text-muted);
		font-size: 0.85rem;
		margin-bottom: 1.5rem;
		line-height: 1.5;
	}
	.export-card .btn {
		width: 100%;
	}
</style>
