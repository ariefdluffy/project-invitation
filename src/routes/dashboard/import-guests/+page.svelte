<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { form }: { data: PageData; form: ActionData } = $props();
	// Note: data.invitationId and data.invitations come from parent layout
</script>

<svelte:head>
	<title>Import Tamu - Wedding.id</title>
</svelte:head>

<div class="page">
	<div class="container">
		<a href="/dashboard/invitations" class="back-link">← Kembali ke Daftar Undangan</a>
		<h1>Import Tamu dari CSV</h1>

		{#if form?.success}
			<div class="alert alert-success">{form.message}</div>
		{/if}
		{#if form?.error}
			<div class="alert alert-error">{form.error}</div>
		{/if}

		<div class="info-box">
			<h3>Format yang didukung:</h3>
			<ul>
				<li>1 nama per baris: <code>John Doe</code></li>
				<li>Multiple nama per baris: <code>John, Jane, Bob</code></li>
				<li>Tab-separated</li>
				<li>Semicolon-separated: <code>John; Jane; Bob</code></li>
			</ul>
			<p>Baris kosong diabaikan. Maks 100 karakter per nama.</p>
		</div>

		<form method="POST">
			<div class="form-group">
				<label for="csv">Data Tamu</label>
				<textarea
					id="csv"
					name="csv"
					rows="12"
					placeholder="John Doe
Jane Smith
Robert Brown

Andi, Budi, Citra
Dewi; Eka; Fajar"
					required
				></textarea>
			</div>

			<div class="actions">
				<button type="submit" class="btn-primary">Import Tamu</button>
				<a href="/dashboard/invitations" class="btn-secondary">Batal</a>
			</div>
		</form>
	</div>
</div>

<style>
    h1 {
        font-family: var(--font-serif);
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
    }
    .back-link {
        display: inline-block;
        margin-bottom: 1rem;
        color: var(--dash-accent);
    }
    .back-link:hover {
        text-decoration: underline;
    }
    .info-box {
        background: var(--dash-surface);
        border: 1px solid var(--dash-border);
        border-radius: var(--radius-md);
        padding: var(--space-lg);
        margin-bottom: var(--space-lg);
        font-size: 0.9rem;
        color: var(--dash-text-muted);
    }
    .info-box h3 {
        color: var(--dash-text);
        margin-bottom: var(--space-sm);
    }
    .info-box ul {
        margin: 0 0 var(--space-md);
        padding-left: var(--space-xl);
    }
    .info-box li {
        margin-bottom: 0.35rem;
    }
    .info-box code {
        background: var(--dash-bg);
        padding: 2px 6px;
        border-radius: 4px;
    }
    textarea {
        width: 100%;
        padding: 0.7rem 1rem;
        background: var(--dash-bg);
        border: 1px solid var(--dash-border);
        border-radius: var(--radius-md);
        color: var(--dash-text);
        font-size: 0.95rem;
        font-family: monospace;
        resize: vertical;
        box-sizing: border-box;
    }
    textarea:focus {
        outline: none;
        border-color: var(--dash-accent);
        box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.15);
    }
    .actions {
        display: flex;
        gap: 0.75rem;
    }
    .btn-primary {
        padding: 0.65rem 1.5rem;
        background: var(--dash-accent);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 600;
    }
    .btn-primary:hover {
        background: var(--dash-accent-hover);
    }
    .btn-secondary {
        padding: 0.65rem 1.5rem;
        background: transparent;
        color: var(--dash-text);
        border: 1px solid var(--dash-border);
        border-radius: var(--radius-md);
        font-size: 0.9rem;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
    }
    .btn-secondary:hover {
        background: var(--dash-surface-hover);
    }
    .alert {
        padding: var(--space-md);
        border-radius: var(--radius-md);
        margin-bottom: var(--space-lg);
        font-size: 0.9rem;
        text-align: center;
    }
    .alert-success {
        background: rgba(39, 174, 96, 0.15);
        color: var(--color-success);
    }
    .alert-error {
        background: rgba(231, 76, 60, 0.1);
        color: var(--color-danger);
    }
</style>
