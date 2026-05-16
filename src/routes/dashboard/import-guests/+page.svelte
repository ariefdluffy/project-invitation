<script lang="ts">
	import type { ActionData } from './$types';

	let { form }: { data: PageData; form: ActionData } = $props();
	// Note: data.invitationId and data.invitations come from parent layout
</script>

<svelte:head>
	<title>Import Tamu - Wedding.id</title>
</svelte:head>

<div class="page">
	<div class="container">
		<a href="/dashboard/invitations" class="back-link">← Kembali ke Daftar Undangan</a>
		<h1>Import Tamu dari CSV</h1>

		{#if form?.success}
			<div class="alert alert-success">{form.message}</div>
		{/if}
		{#if form?.error}
			<div class="alert alert-error">{form.error}</div>
		{/if}

		<div class="info-box">
			<h3>Format yang didukung:</h3>
			<ul>
				<li>1 nama per baris: <code>John Doe</code></li>
				<li>Multiple nama per baris: <code>John, Jane, Bob</code></li>
				<li>Tab-separated</li>
				<li>Semicolon-separated: <code>John; Jane; Bob</code></li>
			</ul>
			<p>Baris kosong diabaikan. Maks 100 karakter per nama.</p>
		</div>

		<form method="POST">
			<div class="form-group">
				<label for="csv">Data Tamu</label>
				<textarea
					id="csv"
					name="csv"
					rows="12"
					placeholder="John Doe
Jane Smith
Robert Brown

Andi, Budi, Citra
Dewi; Eka; Fajar"
					required
				></textarea>
			</div>

			<div class="actions">
				<button type="submit" class="btn-primary">Import Tamu</button>
				<a href="/dashboard/invitations" class="btn-secondary">Batal</a>
			</div>
		</form>
	</div>
</div>

<style>
	.page { min-height: 100vh; background: #f5f5f5; padding: 24px; }
	.container { max-width: 640px; margin: 0 auto; }
	.back-link { display: inline-block; margin-bottom: 16px; color: #d4a574; text-decoration: none; }
	.back-link:hover { text-decoration: underline; }
	h1 { font-size: 22px; color: #1a1a2e; margin: 0 0 24px; }
	.info-box { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 24px; font-size: 14px; }
	.info-box h3 { margin: 0 0 12px; font-size: 15px; }
	.info-box ul { margin: 0; padding-left: 20px; }
	.info-box li { margin-bottom: 6px; color: #666; }
	.info-box code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
	.form-group { margin-bottom: 20px; }
	.form-group label { display: block; font-weight: 600; margin-bottom: 8px; color: #333; }
	textarea { width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; font-family: monospace; resize: vertical; box-sizing: border-box; }
	textarea:focus { outline: none; border-color: #d4a574; }
	.actions { display: flex; gap: 12px; }
	.btn-primary { padding: 10px 24px; background: #d4a574; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; }
	.btn-primary:hover { background: #c49564; }
	.btn-secondary { padding: 10px 24px; background: #fff; color: #666; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; text-decoration: none; display: flex; align-items: center; }
	.btn-secondary:hover { background: #f5f5f5; }
	.alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; text-align: center; }
	.alert-success { background: #e8f5e9; color: #2e7d32; }
	.alert-error { background: #ffebee; color: #c62828; }
</style>
