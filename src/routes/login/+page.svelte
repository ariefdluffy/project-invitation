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

<div class="auth-shell">
	<!-- Brand panel (desktop) -->
	<aside class="auth-brand" aria-hidden="true">
		<div class="brand-orb brand-orb--1"></div>
		<div class="brand-orb brand-orb--2"></div>
		<div class="brand-content">
			<a href="/" class="brand-logo">
				<span class="brand-logo-icon">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
					</svg>
				</span>
				{data.appName}
			</a>
			<h2 class="brand-title">Selamat datang kembali ✨</h2>
			<p class="brand-sub">
				Masuk untuk mengelola undangan digital, daftar tamu, dan momen spesialmu — semuanya di satu tempat.
			</p>
			<ul class="brand-features">
				<li><span class="bf-bullet">✓</span> Sinkron real-time ke semua perangkat</li>
				<li><span class="bf-bullet">✓</span> Template premium siap pakai</li>
				<li><span class="bf-bullet">✓</span> Statistik kunjungan undangan</li>
			</ul>
		</div>
	</aside>

	<!-- Form panel -->
	<main class="auth-panel">
		<div class="auth-card-compact">
			<a href="/" class="mobile-logo">{data.appName}</a>
			<h1>{showResendForm ? 'Kirim ulang verifikasi' : 'Masuk ke akun'}</h1>
			<p class="card-sub">
				{showResendForm
					? 'Masukkan email untuk menerima ulang link verifikasi.'
					: 'Selamat datang kembali, silakan masuk.'}
			</p>

			{#if resetSuccess}
				<div class="alert alert-success">
					<span>✓</span> Password berhasil direset. Silakan login dengan password baru.
				</div>
			{/if}

			{#if registeredSuccess}
				<div class="alert alert-info">
					<span>📧</span> Akun berhasil dibuat. Cek email untuk verifikasi sebelum login.
				</div>
			{/if}

			{#if form?.success}
				<div class="alert alert-success">
					<span>✓</span> Email verifikasi berhasil dikirim ulang. Cek inbox Anda.
				</div>
			{/if}

			{#if !showResendForm}
				{#if form?.error}
					<div class="alert alert-error">
						<span>!</span> {form.error}
					</div>
				{/if}

				<form method="POST" action="?/login" class="auth-form">
					<div class="field">
						<label for="email">Email</label>
						<input type="email" id="email" name="email" class="input" placeholder="kamu@email.com" value={form?.email ?? ''} required autocomplete="email" />
					</div>
					<div class="field">
						<div class="label-row">
							<label for="password">Password</label>
							<a href="/forgot-password" class="forgot-link">Lupa?</a>
						</div>
						<input type="password" id="password" name="password" class="input" placeholder="••••••••" required autocomplete="current-password" />
					</div>

					<div class="turnstile-slot">
						{#if !turnstileReady}
							<div class="turnstile-loading">
								<span class="spinner"></span>
								Memuat verifikasi keamanan...
							</div>
						{/if}
						<div id="cf-turnstile-login" class="cf-turnstile"></div>
					</div>

					<button type="submit" class="btn-primary-full" disabled={!turnstileReady}>
						{turnstileReady ? 'Masuk' : 'Memuat...'}
						{#if turnstileReady}
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<path d="M5 12h14M12 5l7 7-7 7"/>
							</svg>
						{/if}
					</button>
				</form>

				<p class="switch-auth">
					Belum punya akun? <a href="/register">Daftar sekarang</a>
				</p>
			{:else}
				<form method="POST" action="?/resendVerification" class="auth-form">
					<div class="field">
						<label for="resend-email">Email</label>
						<input type="email" id="resend-email" name="email" class="input" placeholder="kamu@email.com" value={form?.email ?? ''} required />
					</div>

					<div class="turnstile-slot">
						{#if !turnstileReady}
							<div class="turnstile-loading">
								<span class="spinner"></span>
								Memuat verifikasi...
							</div>
						{/if}
						<div id="cf-turnstile-resend" class="cf-turnstile"></div>
					</div>

					<button type="submit" class="btn-primary-full" disabled={!turnstileReady}>
						{turnstileReady ? 'Kirim Ulang Email Verifikasi' : 'Memuat...'}
					</button>
				</form>

				{#if !resendSubmitted}
					<button type="button" class="back-link" onclick={() => { showResendForm = false; }}>
						← Kembali ke login
					</button>
				{/if}
			{/if}
		</div>
	</main>
</div>

<style>
	:global(html), :global(body) {
		height: 100%;
	}

	.auth-shell {
		min-height: 100vh;
		min-height: 100dvh;
		display: grid;
		grid-template-columns: 1fr;
		background: var(--dash-bg);
		color: var(--dash-text);
		overflow: hidden;
	}

	@media (min-width: 900px) {
		.auth-shell {
			grid-template-columns: 1fr 1fr;
		}
	}

	/* Brand side */
	.auth-brand {
		display: none;
		position: relative;
		overflow: hidden;
		padding: 3rem 3rem;
		background:
			radial-gradient(circle at 20% 20%, rgba(108, 99, 255, 0.35), transparent 55%),
			radial-gradient(circle at 80% 80%, rgba(167, 139, 250, 0.3), transparent 55%),
			linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
	}

	@media (min-width: 900px) {
		.auth-brand {
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
	}

	.brand-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.4;
		pointer-events: none;
	}

	.brand-orb--1 {
		width: 320px;
		height: 320px;
		background: #6c63ff;
		top: -80px;
		left: -80px;
	}

	.brand-orb--2 {
		width: 400px;
		height: 400px;
		background: #a78bfa;
		bottom: -120px;
		right: -120px;
	}

	.brand-content {
		position: relative;
		z-index: 1;
		max-width: 420px;
	}

	.brand-logo {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		font-family: var(--font-script);
		font-size: 1.6rem;
		color: white;
		margin-bottom: 2.5rem;
		text-decoration: none;
	}

	.brand-logo-icon {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: linear-gradient(135deg, #6c63ff, #a78bfa);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		box-shadow: 0 8px 24px rgba(108, 99, 255, 0.4);
	}

	.brand-title {
		font-family: var(--font-serif);
		font-size: 2rem;
		color: white;
		font-weight: 600;
		line-height: 1.2;
		margin-bottom: 1rem;
	}

	.brand-sub {
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.95rem;
		line-height: 1.65;
		margin-bottom: 2rem;
	}

	.brand-features {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 0;
		margin: 0;
	}

	.brand-features li {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		color: rgba(255, 255, 255, 0.85);
		font-size: 0.9rem;
	}

	.bf-bullet {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: rgba(108, 99, 255, 0.25);
		color: #c4b5fd;
		font-size: 0.75rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	/* Form side */
	.auth-panel {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		min-height: 100vh;
		min-height: 100dvh;
		overflow-y: auto;
	}

	.auth-card-compact {
		width: 100%;
		max-width: 400px;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.mobile-logo {
		font-family: var(--font-script);
		font-size: 1.6rem;
		color: var(--dash-accent);
		text-align: center;
		text-decoration: none;
		margin-bottom: 0.25rem;
	}

	@media (min-width: 900px) {
		.mobile-logo { display: none; }
	}

	.auth-card-compact h1 {
		font-family: var(--font-serif);
		font-size: 1.65rem;
		font-weight: 600;
		color: var(--dash-text);
		text-align: left;
	}

	.card-sub {
		font-size: 0.875rem;
		color: var(--dash-text-muted);
		margin-bottom: 0.4rem;
	}

	.alert {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.65rem 0.85rem;
		border-radius: 10px;
		font-size: 0.825rem;
		line-height: 1.4;
	}

	.alert > span:first-child {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		font-size: 0.75rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.alert-success {
		background: rgba(34, 197, 94, 0.12);
		color: #4ade80;
		border: 1px solid rgba(34, 197, 94, 0.25);
	}
	.alert-success > span:first-child {
		background: rgba(34, 197, 94, 0.25);
	}

	.alert-info {
		background: rgba(108, 99, 255, 0.12);
		color: #a78bfa;
		border: 1px solid rgba(108, 99, 255, 0.25);
	}
	.alert-info > span:first-child {
		background: rgba(108, 99, 255, 0.25);
	}

	.alert-error {
		background: rgba(231, 76, 60, 0.12);
		color: #fca5a5;
		border: 1px solid rgba(231, 76, 60, 0.25);
	}
	.alert-error > span:first-child {
		background: rgba(231, 76, 60, 0.25);
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.label-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.field label {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--dash-text);
		letter-spacing: 0.01em;
	}

	.forgot-link {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--dash-accent);
		text-decoration: none;
	}

	.forgot-link:hover {
		text-decoration: underline;
	}

	.input {
		width: 100%;
		padding: 0.65rem 0.85rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid var(--dash-border);
		border-radius: 10px;
		color: var(--dash-text);
		font-size: 0.9rem;
		transition: all 0.2s;
	}

	.input:focus {
		outline: none;
		border-color: var(--dash-accent);
		background: rgba(255, 255, 255, 0.06);
		box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.18);
	}

	.input::placeholder {
		color: rgba(255, 255, 255, 0.3);
	}

	.turnstile-slot {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 65px;
		margin: 0.15rem 0;
	}

	.turnstile-loading {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.78rem;
		color: var(--dash-text-muted);
		position: absolute;
	}

	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(108, 99, 255, 0.25);
		border-top-color: var(--dash-accent);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.btn-primary-full {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.75rem 1rem;
		background: linear-gradient(135deg, #6c63ff, #7c74ff);
		color: white;
		font-weight: 600;
		font-size: 0.9rem;
		border: none;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 4px 14px rgba(108, 99, 255, 0.35);
	}

	.btn-primary-full:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 8px 22px rgba(108, 99, 255, 0.45);
	}

	.btn-primary-full:disabled {
		opacity: 0.55;
		cursor: not-allowed;
		box-shadow: none;
	}

	.switch-auth {
		text-align: center;
		font-size: 0.85rem;
		color: var(--dash-text-muted);
		margin-top: 0.25rem;
	}

	.switch-auth a {
		color: var(--dash-accent);
		font-weight: 600;
		text-decoration: none;
	}

	.switch-auth a:hover {
		text-decoration: underline;
	}

	.back-link {
		background: none;
		border: none;
		color: var(--dash-text-muted);
		font-size: 0.85rem;
		cursor: pointer;
		padding: 0.5rem 0;
		margin-top: 0.25rem;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: var(--dash-accent);
	}

	@media (max-height: 720px) and (max-width: 900px) {
		.auth-card-compact h1 { font-size: 1.4rem; }
		.card-sub { font-size: 0.8rem; }
		.auth-form { gap: 0.65rem; }
		.input { padding: 0.55rem 0.75rem; }
	}
</style>
