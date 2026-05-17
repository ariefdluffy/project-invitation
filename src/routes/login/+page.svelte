<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { onMount } from 'svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let turnstileReady = $state(false);
	let resetSuccess = $state(false);
	let registeredSuccess = $state(false);
	let showResendForm = $state(false);
	let resendSubmitted = $state(false);

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

	// Auto-show resend form when unverified error occurs
	$effect(() => {
		if (form?.error === "Email belum diverifikasi. Silakan cek inbox email Anda.") {
			showResendForm = true;
		}
	});

	// Reset form visibility after successful resend
	$effect(() => {
		if (form?.success) {
			showResendForm = true; // Keep showing resend form with success message
			resendSubmitted = true;
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

	function renderResendTurnstile() {
		if (typeof (window as any).turnstile !== 'undefined') {
			(window as any).turnstile.render('#cf-turnstile-resend', {
				sitekey: data.turnstileSiteKey,
				theme: 'light',
				callback: () => { turnstileReady = true; },
				expired: () => { turnstileReady = false; },
				error: () => { turnstileReady = false; }
			});
		}
	}

	onMount(() => {
		const checkTurnstile = setInterval(() => {
			if (typeof (window as any).turnstile !== 'undefined') {
				clearInterval(checkTurnstile);
				if (showResendForm) {
					renderResendTurnstile();
				} else {
					renderTurnstile();
				}
			}
		}, 100);

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

		{#if form?.success}
			<div class="success-message">Email verifikasi berhasil dikirim ulang. Silakan cek inbox email Anda.</div>
		{/if}

		{#if !showResendForm}
			{#if form?.error}
				<div class="error-message">{form.error}</div>
			{/if}

			{#if !turnstileReady}
				<div class="info-message">Loading security challenge...</div>
			{/if}

			<form method="POST" action="?/login">
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
		{:else}
			{#if !resendSubmitted}
				<div class="resend-info">
					<p>Silakan masukkan email Anda untuk menerima ulang link verifikasi.</p>
				</div>
			{/if}

			<form method="POST" action="?/resendVerification">
				<div class="form-group">
					<label for="resend-email">Email</label>
					<input type="email" id="resend-email" name="email" class="form-control" placeholder="masukkan email" value={form?.email ?? ''} required />
				</div>
				<div class="form-group turnstile-container">
					<div id="cf-turnstile-resend" class="cf-turnstile"></div>
				</div>
				<button type="submit" class="btn btn-secondary" disabled={!turnstileReady}>
					{turnstileReady ? 'Kirim Ulang Email Verifikasi' : 'Memuat...'}
				</button>
			</form>

			{#if !resendSubmitted}
				<button type="button" class="btn btn-link" onclick={() => { showResendForm = false; }}>
					← Kembali ke login
				</button>
			{/if}
		{/if}

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
	.info-message {
		background: #fff3cd;
		color: #856404;
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 16px;
		font-size: 14px;
		text-align: center;
	}
	.error-message {
		background: #ffebee;
		color: #c62828;
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 16px;
		font-size: 14px;
		text-align: center;
	}
	.resend-info {
		background: #e3f2fd;
		color: #1565c0;
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 16px;
		font-size: 14px;
		text-align: center;
	}
	.btn-link {
		background: none;
		border: none;
		color: #1976d2;
		cursor: pointer;
		padding: 12px 0;
		font-size: 14px;
		text-decoration: underline;
	}
	.btn-link:hover {
		color: #0d47a1;
	}
	.btn-secondary {
		background: #1976d2;
		color: white;
	}
	.btn-secondary:hover {
		background: #1565c0;
	}
</style>
