<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { toast } from '$lib/toast.svelte';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();
	let toastShown = false;

	$effect(() => {
		if (data.error === 'limit_reached' && !toastShown) {
			toast.error(`Anda telah mencapai batas maksimal membuat undangan (${data.user.invitation_limit}).`);
			toastShown = true;
		}
	});

	const isAtLimit = $derived(
		data.user && 
		data.invitations && 
		data.user.role !== 'admin' && 
		data.invitations.length >= data.user.invitation_limit
	);

	function formatDate(dateStr: any) {
		if (!dateStr || dateStr === '0000-00-00') return null;
		try {
			const d = new Date(dateStr);
			if (isNaN(d.getTime())) return null;
			return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
		} catch (e) {
			return null;
		}
	}
</script>

<svelte:head>
	<title>Undangan Saya - {data.appName}</title>
</svelte:head>

<div class="dash-header">
	<div>
		<h1>Undangan Saya</h1>
		<p class="dash-header-sub">Kelola semua undangan pernikahanmu</p>
	</div>
	{#if !isAtLimit}
		<a href="/dashboard/create" class="btn btn-primary">
			+ Buat Baru
		</a>
	{/if}
</div>

{#if isAtLimit}
	<div class="dash-banner warning" style="margin-bottom: 2rem;">
		<div class="banner-content">
			<span class="banner-icon">💡</span>
			<div class="banner-text">
				<strong>Limit Tercapai</strong>
				<p>Anda telah membuat {data.invitations.length} dari {data.user?.invitation_limit} undangan yang diizinkan. Hubungi admin untuk menambah kuota.</p>
			</div>
		</div>
	</div>
{/if}

{#if !data.invitations || data.invitations.length === 0}
	<div class="dash-card">
		<div class="empty-state">
			<div class="empty-icon">📋</div>
			<h3>Belum ada undangan</h3>
			<p>Buat undangan pertamamu sekarang</p>
			<a href="/dashboard/create" class="btn btn-primary">Buat Undangan</a>
		</div>
	</div>
{:else}
	<div class="inv-grid">
		{#each data.invitations as inv, i}
			<div class="inv-card" style="animation: fadeInUp 0.5s ease {i * 0.1}s both">
				<div class="inv-card-top">
					<div class="inv-status">
						<span class="badge-dot {inv.is_published ? 'active' : 'draft'}"></span>
						<span class="status-text">{inv.is_published ? 'Aktif / Terbit' : 'Draft / Konsep'}</span>
					</div>
					<div class="inv-template-tag">Template: {inv.template_id.replace('-', ' ')}</div>
				</div>
				
				<div class="inv-card-body">
					<h3 class="couple-names">{inv.bride_name} & {inv.groom_name}</h3>
					<div class="inv-info-row">
						<span class="info-label">URL:</span>
						<code class="slug-text">/{inv.slug}</code>
					</div>
					{#if formatDate(inv.akad_date)}
						<div class="inv-info-row">
							<span class="info-label">Acara:</span>
							<span class="date-text">{formatDate(inv.akad_date)}</span>
						</div>
					{/if}
				</div>

				<div class="inv-card-footer">
					<a href="/dashboard/invitations/{inv.id}" class="btn-action primary" title="Edit Data">
						<span>✏️</span> Kelola
					</a>
					<form method="POST" action="?/duplicate" use:enhance style="flex: 1;">
						<input type="hidden" name="id" value={inv.id} />
						<button type="submit" class="btn-action secondary w-full" title="Copy data ke undangan baru">
							<span>👯</span> Duplikat
						</button>
					</form>
					{#if inv.is_published}
						<a href="/invitation/{inv.slug}" target="_blank" class="btn-action secondary" title="Lihat Tampilan">
							<span>👁️</span> Lihat
						</a>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	.dash-header-sub {
		color: var(--dash-text-muted);
		font-size: 0.95rem;
		margin-top: 0.25rem;
	}
	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
	}
	.empty-icon {
		font-size: 3.5rem;
		margin-bottom: 1rem;
		display: block;
	}
	.empty-state h3 {
		font-family: var(--font-serif);
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}
	.empty-state p {
		color: var(--dash-text-muted);
		margin-bottom: 2rem;
	}

	/* New Grid & Card Style - Balanced Size */
	.inv-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
	}

	.inv-card {
		background: #1e1e2e; /* Deep dark background */
		border: 1px solid rgba(255,255,255,0.05);
		border-radius: 14px;
		display: flex;
		flex-direction: column;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
		box-shadow: 0 4px 20px rgba(0,0,0,0.15);
	}

	.inv-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 30px rgba(0,0,0,0.3);
		border-color: var(--dash-accent);
	}

	.inv-card-top {
		padding: 0.85rem 1.25rem;
		background: rgba(255, 255, 255, 0.02);
		border-bottom: 1px solid rgba(255,255,255,0.05);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.inv-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.badge-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.badge-dot.active {
		background: #22c55e;
		box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
	}

	.badge-dot.draft {
		background: #f59e0b;
	}

	.status-text {
		font-size: 0.7rem;
		font-weight: 700;
		color: #888;
		text-transform: uppercase;
		letter-spacing: 0.8px;
	}

	.inv-card:has(.badge-dot.active) .status-text {
		color: #22c55e; /* Green for published */
	}

	.inv-template-tag {
		font-size: 0.65rem;
		color: #777;
		background: rgba(255,255,255,0.04);
		padding: 0.2rem 0.6rem;
		border-radius: 6px;
		text-transform: capitalize;
	}

	.inv-card-body {
		padding: 1.5rem;
		flex: 1;
	}

	.couple-names {
		font-family: var(--font-serif);
		font-size: 1.35rem;
		color: #ffffff;
		margin-bottom: 0.85rem;
		line-height: 1.2;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.inv-info-row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.4rem;
		font-size: 0.85rem;
	}

	.info-label {
		color: #666;
		font-size: 0.8rem;
		min-width: 40px;
	}

	.slug-text {
		color: #9d96ff;
		font-weight: 500;
		font-family: monospace;
	}

	.date-text {
		color: #ccc;
	}

	.inv-card-footer {
		padding: 1rem 1.25rem;
		background: rgba(0,0,0,0.15);
		border-top: 1px solid rgba(255,255,255,0.05);
		display: flex;
		gap: 0.6rem;
	}

	.btn-action {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.6rem 0.4rem;
		border-radius: 10px;
		text-decoration: none;
		font-size: 0.8rem;
		font-weight: 600;
		transition: all 0.2s;
	}

	.btn-action span {
		font-size: 1rem;
	}

	.btn-action.primary {
		background: var(--dash-accent);
		color: white;
		border: none;
	}

	.btn-action.primary:hover {
		background: #564ed9;
		box-shadow: 0 4px 12px rgba(108, 99, 255, 0.2);
	}

	.btn-action.secondary {
		background: rgba(255, 255, 255, 0.04);
		color: #ccc;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.btn-action.secondary:hover {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}

	.w-full {
		width: 100%;
	}
	button.btn-action {
		cursor: pointer;
		font-family: inherit;
	}
</style>
