<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { onMount } from 'svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let turnstileReady = $state(false);
	let resetSuccess = $state(false);
	let registeredSuccess = $state(false);

	$effect(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.get('reset') === 'success') {
			resetSuccess = true;
			window.history.replaceState({}, '', '/login');
		}
		if (params.get('registered') === '1') {
			registeredSuccess = true;
			window.history.replaceState({}, '', '/login');
		}
	});

	function renderTurnstile() {
		if (typeof (window as any).turnstile !== 'undefined') {
			(window as any).turnstile.render('#cf-turnstile-login', {
				sitekey: data.turnstileSiteKey,
				theme: 'light',
				callback: () => { turnstileReady = true; },
				expired: () => { turnstileReady = false; },
				error: () => { turnstileReady = false; }
			});
		}
	}

	onMount(() => {
		// Wait for turnstile script to load
		const checkTurnstile = setInterval(() => {
			if (typeof (window as any).turnstile !== 'undefined') {
				clearInterval(checkTurnstile);
				renderTurnstile();
			}
		}, 100);

		// Timeout after 10 seconds
		setTimeout(() => clearInterval(checkTurnstile), 10000);
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

		{#if registeredSuccess}
			<div class="info-message">Akun berhasil dibuat. Silakan cek email untuk verifikasi sebelum login.</div>
		{/if}

		{#if form?.error}
			<div class="error-message">{form.error}</div>
		{/if}

		{#if !turnstileReady}
			<div class="info-message">Loading security challenge...</div>
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
				<div id="cf-turnstile-login" class="cf-turnstile"></div>
			</div>
			<button type="submit" class="btn btn-primary" disabled={!turnstileReady}>
				{turnstileReady ? 'Masuk' : 'Memuat...'}
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
	.turnstile-container { display: flex; justify-content: center; margin: 15px 0; min-height: 65px; }
	.success-message {
		background: #e8f5e9;
		color: #2e7d32;
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 16px;
		font-size: 14px;
		text-align: center;
	}
</style>
