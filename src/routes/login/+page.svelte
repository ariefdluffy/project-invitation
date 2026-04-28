<script lang="ts">
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Masuk - {data.appName}</title>
	<meta name="description" content="Masuk ke akun {data.appName} untuk mengelola undangan pernikahanmu" />
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<h1>{data.appName}</h1>
		<p>Masuk ke akunmu untuk mengelola undangan</p>

		{#if form?.error}
			<div class="error-message">{form.error}</div>
		{/if}

		<form method="POST">
			<div class="form-group">
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					class="form-control"
					placeholder="masukkan email"
					value={form?.email ?? ''}
					required
				/>
			</div>
			<div class="form-group">
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					class="form-control"
					placeholder="masukkan password"
					required
				/>
			</div>
			<button type="submit" class="btn btn-primary">Masuk</button>
		</form>

		<div class="auth-links">
			Belum punya akun? <a href="/register">Daftar sekarang</a>
		</div>
	</div>
</div>

<style>
</style>
