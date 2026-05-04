<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { onMount } from 'svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let turnstileWidgetId: string | null = $state(null);

	onMount(() => {
		const container = document.getElementById('cf-turnstile-register');
		if (!container) return;

		const renderTurnstile = () => {
			if (typeof (window as any).turnstile !== 'undefined') {
				turnstileWidgetId = (window as any).turnstile.render('#cf-turnstile-register', {
					sitekey: '0x4AAAAAADIp8xx5AfGgcwB6',
					theme: 'light'
				}) as string;
			}
		};

		if (document.querySelector('script[src*="turnstile"]')) {
			renderTurnstile();
		} else {
			const script = document.createElement('script');
			script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
			script.async = true;
			script.defer = true;
			script.onload = renderTurnstile;
			document.head.appendChild(script);
		}

		return () => {
			if (turnstileWidgetId && typeof (window as any).turnstile !== 'undefined') {
				(window as any).turnstile.remove(turnstileWidgetId);
			}
		};
	});
</script>

<svelte:head>
	<title>Daftar - {data.appName}</title>
	<meta name="description" content="Daftar akun {data.appName} untuk membuat undangan pernikahan digital" />
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<h1>{data.appName}</h1>
		<p>Buat akun untuk mulai membuat undangan</p>

		{#if form?.error}
			<div class="error-message">{form.error}</div>
		{/if}

		<form method="POST">
			<div class="form-group">
				<label for="username">Username</label>
				<input type="text" id="username" name="username" class="form-control" placeholder="masukkan username" value={form?.username ?? ''} required />
			</div>
			<div class="form-group">
				<label for="email">Email</label>
				<input type="email" id="email" name="email" class="form-control" placeholder="masukkan email" value={form?.email ?? ''} required />
			</div>
			<div class="form-group">
				<label for="password">Password</label>
				<input type="password" id="password" name="password" class="form-control" placeholder="minimal 6 karakter" required />
			</div>
			<div class="form-group">
				<label for="confirmPassword">Konfirmasi Password</label>
				<input type="password" id="confirmPassword" name="confirmPassword" class="form-control" placeholder="ulangi password" required />
			</div>
			<div class="form-group turnstile-container">
				<div id="cf-turnstile-register" class="cf-turnstile"></div>
			</div>
			<button type="submit" class="btn btn-primary">Daftar</button>
		</form>
		<div class="auth-links">
			Sudah punya akun? <a href="/login">Masuk di sini</a>
		</div>
	</div>
</div>

<style>
	.turnstile-container { display: flex; justify-content: center; margin: 15px 0; min-height: 65px; }
</style>
