<script lang="ts">
	let { data }: { data: { success: boolean; error?: string } } = $props();
</script>

<svelte:head>
	<title>Verifikasi Email - {data.success ? 'Berhasil' : 'Gagal'}</title>
</svelte:head>

<div class="verify-page">
	<div class="verify-card">
		{#if data.success}
			<div class="success-icon">✓</div>
			<h1>Email Terverifikasi!</h1>
			<p>Email Anda berhasil diverifikasi. Sekarang Anda bisa login.</p>
			<a href="/login" class="btn-primary">Masuk ke Akun</a>
		{:else}
			<div class="error-icon">✗</div>
			<h1>Verifikasi Gagal</h1>
			<p>{data.error || 'Link verifikasi tidak valid atau sudah expired.'}</p>
			<a href="/register" class="btn-secondary">Daftar Ulang</a>
		{/if}
	</div>
</div>

<style>
	.verify-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
		padding: 24px;
	}
	.verify-card {
		background: #fff;
		border-radius: 16px;
		padding: 48px 40px;
		max-width: 420px;
		width: 100%;
		box-shadow: 0 20px 60px rgba(0,0,0,0.3);
		text-align: center;
	}
	h1 {
		font-size: 24px;
		color: #1a1a2e;
		margin: 0 0 16px;
	}
	p {
		color: #666;
		font-size: 14px;
		margin: 0 0 32px;
		line-height: 1.6;
	}
	.success-icon {
		width: 80px;
		height: 80px;
		background: #e8f5e9;
		color: #2e7d32;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 40px;
		margin: 0 auto 24px;
	}
	.error-icon {
		width: 80px;
		height: 80px;
		background: #ffebee;
		color: #c62828;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 40px;
		margin: 0 auto 24px;
	}
	.btn-primary {
		display: inline-block;
		padding: 12px 32px;
		background: #d4a574;
		color: #fff;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
	}
	.btn-secondary {
		display: inline-block;
		padding: 12px 32px;
		background: #e0e0e0;
		color: #333;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
	}
</style>
