<script lang="ts">
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Reset Password - Wedding.id</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<div class="auth-header">
			<h1>Reset Password</h1>
			<p>Masukkan password baru Anda.</p>
		</div>

		{#if data?.error}
			<div class="alert alert-error">{data.error}</div>
		{:else if form?.error}
			<div class="alert alert-error">{form.error}</div>
		{:else}
			<form method="POST">
				<div class="form-group">
					<label for="password">Password Baru</label>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="Minimal 6 karakter"
						required
						minlength="6"
						autocomplete="new-password"
					/>
				</div>

				<div class="form-group">
					<label for="confirmPassword">Konfirmasi Password</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						placeholder="Ulangi password baru"
						required
						minlength="6"
						autocomplete="new-password"
					/>
				</div>

				<button type="submit" class="btn-primary btn-full">
					Reset Password
				</button>
			</form>

			<div class="auth-footer">
				<a href="/login">Kembali ke Login</a>
			</div>
		{/if}
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
