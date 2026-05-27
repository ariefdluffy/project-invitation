<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { onMount } from 'svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let resetSuccess = $state(false);

	$effect(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			if (params.get('reset') === 'success') {
				resetSuccess = true;
				window.history.replaceState({}, '', '/login');
			}
		}
	});

	let turnstileWidgetId: string | null = $state(null);
	let turnstileReady = $state(false);
	let turnstileError = $state(false);
	let turnstileLoading = $state(true);

	onMount(() => {
		const SCRIPT_ID = 'cf-turnstile-script';
		const CONTAINER_ID = 'cf-turnstile-login';

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
	<title>Masuk - {data.appName}</title>
	<meta name="description" content="Masuk ke akun {data.appName} untuk mengelola undangan pernikahanmu" />
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<h1>{data.appName}</h1>
		<p>Masuk ke akunmu untuk mengelola undangan</p>

		{#if resetSuccess}
			<div class="success-message">Password berhasil direset. Silakan login dengan password baru.</div>
		{/if}

		{#if form?.error}
			<div class="error-message">{form.error}</div>
		{/if}

		<form method="POST">
			<div class="form-group">
				<label for="email">Email</label>
				<input type="email" id="email" name="email" class="form-control" placeholder="masukkan email" value={form?.email ?? ''} required />
			</div>
			<div class="form-group">
				<label for="password">Password</label>
				<input type="password" id="password" name="password" class="form-control" placeholder="masukkan password" required />
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
				<div id="cf-turnstile-login" style={turnstileLoading ? 'display:none' : ''}></div>
			</div>

			<button type="submit" class="btn btn-primary" disabled={!turnstileReady || turnstileError}>
				{#if turnstileLoading}
					Memuat...
				{:else}
					Masuk
				{/if}
			</button>
		</form>
		<div class="auth-links">
			<a href="/forgot-password">Lupa password?</a>
		</div>
		<div class="auth-links">
			Belum punya akun? <a href="/register">Daftar sekarang</a>
		</div>
	</div>
</div>

<style>
	.turnstile-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 15px 0;
		min-height: 65px;
	}
	.turnstile-loading {
		color: #666;
		font-size: 0.875rem;
		padding: 8px;
	}
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
	.success-message {
		background: #e8f5e9;
		color: #2e7d32;
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 16px;
		font-size: 0.9rem;
	}
	.error-message {
		background: #ffebee;
		color: #c62828;
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 16px;
		font-size: 0.9rem;
		text-align: center;
	}
	button:disabled {
		background: #ccc !important;
		cursor: not-allowed;
	}
</style>
