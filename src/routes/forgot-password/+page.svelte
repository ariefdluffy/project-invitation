<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { onMount } from 'svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let turnstileReady = $state(false);

	onMount(() => {
		if (typeof window !== 'undefined' && (window as any).turnstile) {
			const container = document.getElementById('cf-turnstile-forgot');
			if (container) {
				(window as any).turnstile.render(container, {
					sitekey: data.turnstileSiteKey,
					theme: 'light',
					callback: () => { turnstileReady = true; },
					expired: () => { turnstileReady = false; },
					error: () => { turnstileReady = false; }
				});
			}
		}
	});
</script>

<svelte:head>
	<title>Lupa Password - Wedding.id</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<div class="auth-header">
			<h1>Lupa Password</h1>
			<p>Masukkan email Anda untuk menerima link reset password.</p>
		</div>

		{#if form?.success}
			<div class="alert alert-success">{form.message}</div>
		{/if}

		{#if form?.error}
			<div class="alert alert-error">{form.error}</div>
		{/if}

		{#if !turnstileReady}
			<div class="info-message">Loading security challenge...</div>
		{/if}

		<form method="POST">
			<div class="form-group">
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					placeholder="nama@email.com"
					required
					autocomplete="email"
				/>
			</div>

			<!-- Cloudflare Turnstile -->
			<div class="form-group">
				<div id="cf-turnstile-forgot"></div>
			</div>

			<button type="submit" class="btn-primary btn-full" disabled={!turnstileReady}>
				{turnstileReady ? 'Kirim Link Reset' : 'Memuat...'}
			</button>
		</form>

		<div class="auth-footer">
			<a href="/login">Kembali ke Login</a>
		</div>
	</div>
</div>

<style>
	.auth-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
		padding: 24px;
	}
	.auth-card {
		background: #fff;
		border-radius: 16px;
		padding: 40px;
		max-width: 420px;
		width: 100%;
		box-shadow: 0 20px 60px rgba(0,0,0,0.3);
	}
	.auth-header {
		text-align: center;
		margin-bottom: 32px;
	}
	.auth-header h1 {
		font-size: 24px;
		color: #1a1a2e;
		margin: 0 0 8px;
	}
	.auth-header p {
		color: #666;
		font-size: 14px;
		margin: 0;
	}
	.form-group {
		margin-bottom: 20px;
	}
	.form-group label {
		display: block;
		font-size: 14px;
		font-weight: 600;
		color: #333;
		margin-bottom: 6px;
	}
	.form-group input {
		width: 100%;
		padding: 12px 16px;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 14px;
		transition: border-color 0.2s;
		box-sizing: border-box;
	}
	.form-group input:focus {
		outline: none;
		border-color: #d4a574;
	}
	.btn-full { width: 100%; }
	.btn-primary {
		padding: 12px 24px;
		background: #d4a574;
		color: #fff;
		border: none;
		border-radius: 8px;
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}
	.btn-primary:hover { background: #c49564; }
	.auth-footer {
		text-align: center;
		margin-top: 24px;
	}
	.auth-footer a {
		color: #d4a574;
		text-decoration: none;
		font-size: 14px;
	}
	.auth-footer a:hover { text-decoration: underline; }
	.alert {
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 20px;
		font-size: 14px;
		text-align: center;
	}
	.alert-success { background: #e8f5e9; color: #2e7d32; }
	.alert-error { background: #ffebee; color: #c62828; }
	.info-message { background: #fff3cd; color: #856404; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 13px; text-align: center; }
	button:disabled { background: #ccc; cursor: not-allowed; }
</style>
