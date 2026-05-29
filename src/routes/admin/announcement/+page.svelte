<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/toast.svelte';

	let form: ActionData = $props();
	let subject = $state('');
	let body = $state('');
	let target = $state('all');
	let sending = $state(false);

	function handleEnhance() {
		return async ({ result, update }: any) => {
			await update();
			sending = false;
			if (result.type === 'success') {
				const d = result.data as { message?: string };
				if (d?.message) { toast.success(d.message); subject = ''; body = ''; }
			} else if (result.type === 'failure') {
				const d = result.data as { error?: string };
				if (d?.error) toast.error(d.error);
			}
		};
	}

	function doSend() {
		if (!confirm('Yakin kirim broadcast ke ' + (target === 'all' ? 'SEMUA' : target === 'paid' ? 'user PAID' : 'user UNPAID') + ' user?\n\nIni akan mengirim email massal.')) return;
		sending = true;
		const form = document.querySelector('#announce-form') as HTMLFormElement;
		form.requestSubmit();
	}
</script>

<svelte:head><title>Announcement - Admin</title></svelte:head>

<div class="dash-header"><h1>📣 Broadcast / Announcement</h1></div>

<div class="dash-card" style="max-width:700px">
	<p class="warning-note">⚠️ Fitur ini mengirim email massal. Gunakan dengan hati-hati. 1x per 5 menit.</p>

	<form id="announce-form" method="POST" action="?/send" use:enhance={handleEnhance}>
		<div class="form-group">
			<label for="target">Target User</label>
			<select id="target" name="target" class="form-control" bind:value={target}>
				<option value="all">Semua User</option>
				<option value="paid">User Sudah Bayar</option>
				<option value="unpaid">User Belum Bayar</option>
			</select>
		</div>
		<div class="form-group">
			<label for="subject">Subject Email</label>
			<input id="subject" name="subject" class="form-control" bind:value={subject} maxlength="200" required placeholder="Pengumuman penting..." />
		</div>
		<div class="form-group">
			<label for="body">Body Email (HTML supported)</label>
			<textarea id="body" name="body" class="form-control" rows="10" bind:value={body} required placeholder={'<p>Halo {username},</p><p>...</p>'}></textarea>
			<p class="muted">Variabel: <code>{'{username}'}</code> akan diganti otomatis</p>
		</div>
		<button type="button" class="btn btn-primary" onclick={doSend} disabled={sending || !subject || !body}>
			{sending ? '⏳ Mengirim...' : '📤 Kirim Broadcast'}
		</button>
	</form>
</div>

<style>
	.warning-note {
		background: #fef3c7;
		color: #b45309;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		font-size: 0.85rem;
		margin-bottom: 1.5rem;
	}
	.muted { color: var(--dash-text-muted); font-size: 0.8rem; margin-top: 0.25rem; }
	.form-group { margin-bottom: 1rem; }
	.form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.25rem; color: var(--dash-text-muted); }
	.form-control { width: 100%; padding: 0.6rem 0.75rem; border: 1px solid var(--dash-border); border-radius: 6px; font-size: 0.9rem; background: var(--bg-color, #fff); }
	textarea.form-control { font-family: monospace; font-size: 0.85rem; }
</style>
