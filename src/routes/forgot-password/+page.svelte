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
	.auth-header h1 {
		color: var(--dash-text);
	}
	.auth-footer a {
		color: var(--dash-accent);
	}
</style>
