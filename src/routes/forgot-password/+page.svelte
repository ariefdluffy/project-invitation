<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { onMount } from 'svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let turnstileWidgetId: string | null = $state(null);
	let turnstileReady = $state(false);
	let turnstileError = $state(false);
	let turnstileLoading = $state(true);

	onMount(() => {
		const SCRIPT_ID = 'cf-turnstile-script';
		const CONTAINER_ID = 'cf-turnstile-forgot';

		const renderWidget = () => {
			const container = document.getElementById(CONTAINER_ID);
			if (!container || turnstileWidgetId) return;

			try {
				turnstileWidgetId = (window as any).turnstile.render(`#${CONTAINER_ID}`, {
					sitekey: data.turnstileSiteKey,
					theme: 'light',
					callback: () => {
						turnstileReady = true;
						turnstileError = false;
						turnstileLoading = false;
					},
					'expired-callback': () => {
						turnstileReady = false;
						turnstileLoading = false;
					},
					'error-callback': (code: string) => {
						console.error('[Turnstile] Widget error:', code);
						turnstileReady = false;
						turnstileError = true;
						turnstileLoading = false;
					},
					'timeout-callback': () => {
						turnstileReady = false;
						turnstileLoading = false;
					}
				}) as string;
			} catch (err) {
				console.error('[Turnstile] Render error:', err);
				turnstileError = true;
				turnstileLoading = false;
			}
		};

		if (typeof (window as any).turnstile !== 'undefined') {
			turnstileLoading = false;
			renderWidget();
			return;
		}

		if (document.getElementById(SCRIPT_ID)) {
			const checkReady = setInterval(() => {
				if (typeof (window as any).turnstile !== 'undefined') {
					clearInterval(checkReady);
					turnstileLoading = false;
					renderWidget();
				}
			}, 100);
			setTimeout(() => {
				clearInterval(checkReady);
				if (!turnstileReady) {
					turnstileError = true;
					turnstileLoading = false;
				}
			}, 10000);
			return;
		}

		const script = document.createElement('script');
		script.id = SCRIPT_ID;
		script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
		script.async = true;
		script.defer = true;
		script.onload = () => {
			turnstileLoading = false;
			renderWidget();
		};
		script.onerror = () => {
			console.error('[Turnstile] Failed to load script');
			turnstileError = true;
			turnstileLoading = false;
		};
		document.head.appendChild(script);

		return () => {
			if (turnstileWidgetId && typeof (window as any).turnstile !== 'undefined') {
				try { (window as any).turnstile.remove(turnstileWidgetId); } catch {}
				turnstileWidgetId = null;
			}
		};
	});
</script>

<svelte:head>
	<title>Lupa Password - {data.appName}</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<div class="auth-header">
			<h1>Lupa Password</h1>
			<p>Masukkan email Anda untuk menerima link reset password.</p>
		</div>

		{#if (form as any)?.success}
			<div class="alert alert-success">{(form as any).message}</div>
		{/if}

		{#if (form as any)?.error}
			<div class="alert alert-error">{(form as any).error}</div>
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

			<div class="form-group turnstile-container">
				{#if turnstileLoading}
					<div class="turnstile-loading">⏳ Memuat verifikasi keamanan...</div>
				{/if}
				{#if turnstileError}
					<div class="turnstile-error">
						⚠️ Gagal memuat verifikasi keamanan.
						<button type="button" onclick={() => {
							turnstileError = false;
							turnstileLoading = true;
							if (turnstileWidgetId && (window as any).turnstile) {
								(window as any).turnstile.reset(turnstileWidgetId);
								turnstileLoading = false;
							}
						}}>
							Coba lagi
						</button>
					</div>
				{/if}
				<div id="cf-turnstile-forgot" style={turnstileLoading ? 'display:none' : ''}></div>
			</div>

			<button type="submit" class="btn-primary btn-full" disabled={!turnstileReady || turnstileError}>
				{#if turnstileLoading}
					Memuat...
				{:else}
					Kirim Link Reset
				{/if}
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
	.auth-header { text-align: center; margin-bottom: 32px; }
	.auth-header h1 { font-size: 24px; color: #1a1a2e; margin: 0 0 8px; }
	.auth-header p { color: #666; font-size: 14px; margin: 0; }
	.form-group { margin-bottom: 20px; }
	.form-group label { display: block; font-size: 14px; font-weight: 600; color: #333; margin-bottom: 6px; }
	.form-group input {
		width: 100%;
		padding: 12px 16px;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 14px;
		transition: border-color 0.2s;
		box-sizing: border-box;
	}
	.form-group input:focus { outline: none; border-color: #d4a574; }
	.turnstile-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 65px;
	}
	.turnstile-loading { color: #666; font-size: 0.875rem; padding: 8px; }
	.turnstile-error {
		color: #c0392b;
		font-size: 0.875rem;
		padding: 8px;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.turnstile-error button {
		background: none;
		border: 1px solid #c0392b;
		color: #c0392b;
		padding: 2px 8px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.8rem;
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
	.btn-primary:disabled { background: #ccc !important; cursor: not-allowed; }
	.auth-footer { text-align: center; margin-top: 24px; }
	.auth-footer a { color: #d4a574; text-decoration: none; font-size: 14px; }
	.auth-footer a:hover { text-decoration: underline; }
	.alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; text-align: center; }
	.alert-success { background: #e8f5e9; color: #2e7d32; }
	.alert-error { background: #ffebee; color: #c62828; }
</style>
