<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/toast.svelte';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		if (data.error) {
			toast.error(data.error);
		}
	});

	function handlePay() {
		if (!data.snapToken) {
			toast.error("Snap Token tidak ditemukan. Silakan refresh halaman.");
			return;
		}

		// @ts-ignore
		window.snap.pay(data.snapToken, {
			onSuccess: function(result: any) {
				toast.success("Pembayaran Berhasil! Mengalihkan...");
				setTimeout(() => goto('/dashboard/billing'), 2000);
			},
			onPending: function(result: any) {
				toast.info("Menunggu pembayaran Anda.");
				setTimeout(() => goto('/dashboard/billing'), 2000);
			},
			onError: function(result: any) {
				toast.error("Pembayaran gagal. Silakan coba lagi.");
			},
			onClose: function() {
				toast.info("Anda menutup halaman pembayaran.");
			}
		});
	}
</script>

<svelte:head>
	<title>Checkout Pembayaran - {data.appName}</title>
	{#if !data.error && data.clientKey}
		<script
			src={data.isProduction
				? 'https://app.midtrans.com/snap/snap.js'
				: 'https://app.sandbox.midtrans.com/snap/snap.js'}
			data-client-key={data.clientKey}
		></script>
	{/if}
</svelte:head>

<div class="checkout-container">
	<a href="/dashboard/billing" class="back-link">
		<svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<path d="M19 12H5M12 19l-7-7 7-7" />
		</svg>
		Kembali ke Billing
	</a>

	<div class="checkout-card animate-fade-in">
		{#if data.error}
			<div class="checkout-card__accent checkout-card__accent--error"></div>
			<div class="error-state">
				<div class="error-icon" aria-hidden="true">!</div>
				<h3>Tidak dapat membuka pembayaran</h3>
				<p class="error-copy">{data.error}</p>
				<a href="/dashboard/billing" class="btn btn-secondary checkout-back-btn">Kembali ke Billing</a>
			</div>
		{:else}
			<div class="checkout-card__accent"></div>

			<header class="checkout-head">
				<div class="checkout-icon-wrap" aria-hidden="true">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
						<rect x="2" y="5" width="20" height="14" rx="2" />
						<path d="M2 10h20" />
					</svg>
				</div>
				<p class="checkout-eyebrow">Checkout Midtrans</p>
				<h2 class="checkout-title">Konfirmasi pembayaran</h2>
				<p class="checkout-lead">
					Sebentar lagi Anda memilih metode bayar (QRIS, e-wallet, VA, kartu) di jendela aman Midtrans.
				</p>
				{#if data.isProduction}
					<span class="env-pill env-pill--live">Mode production</span>
				{:else}
					<span class="env-pill env-pill--sandbox">Sandbox</span>
				{/if}
			</header>

			<section class="checkout-summary" aria-label="Ringkasan pesanan">
				<div class="summary-row">
					<span class="summary-label">Layanan</span>
					<span class="summary-value">{data.itemName}</span>
				</div>
				<div class="summary-row summary-row--stack">
					<span class="summary-label">ID pesanan</span>
					<code class="order-id" title={data.orderId}>{data.orderId}</code>
				</div>
				<div class="summary-total">
					<div class="summary-total__text">
						<span class="total-label">Total pembayaran</span>
						<span class="total-hint">Sesuai tagihan di layar Midtrans</span>
					</div>
					<span class="total-rp">Rp {Number(data.amount).toLocaleString('id-ID')}</span>
				</div>
			</section>

			<div class="checkout-trust" role="status">
				<span class="trust-item">Midtrans Snap</span>
				<span class="trust-dot" aria-hidden="true"></span>
				<span class="trust-item">Enkripsi TLS</span>
				<span class="trust-dot" aria-hidden="true"></span>
				<span class="trust-item">Tanpa simpan kartu di server kami</span>
			</div>

			<div class="checkout-actions">
				<button type="button" class="checkout-pay-btn" onclick={handlePay}>
					<span class="checkout-pay-btn__label">Bayar sekarang</span>
					<span class="checkout-pay-btn__hint">Buka popup pembayaran</span>
					<svg class="checkout-pay-btn__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path d="M9 18l6-6-6-6" />
					</svg>
				</button>
				<p class="checkout-help">
					Izinkan popup jika browser meminta. Anda dapat menutup jendela Snap dan kembali ke billing kapan saja.
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes checkout-fade-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: checkout-fade-in 0.45s ease both;
	}

	.checkout-container {
		max-width: 440px;
		margin: 2rem auto 3rem;
		padding: 0 1rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-bottom: 1.25rem;
		color: var(--dash-text-muted);
		text-decoration: none;
		font-size: 0.88rem;
		font-weight: 600;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: var(--dash-accent);
	}

	.back-icon {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
	}

	.checkout-card {
		position: relative;
		background: var(--dash-surface);
		border: 1px solid var(--dash-border);
		border-radius: 20px;
		padding: 2rem 1.75rem 2.25rem;
		overflow: hidden;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
	}

	.checkout-card:hover {
		border-color: rgba(108, 99, 255, 0.25);
	}

	.checkout-card__accent {
		position: absolute;
		inset: 0 0 auto 0;
		height: 3px;
		background: linear-gradient(90deg, var(--dash-accent), #a78bfa, #818cf8);
		opacity: 0.95;
	}

	.checkout-card__accent--error {
		background: linear-gradient(90deg, #f87171, #ef4444);
	}

	.checkout-head {
		text-align: center;
		margin-bottom: 1.75rem;
		padding-top: 0.25rem;
	}

	.checkout-icon-wrap {
		width: 52px;
		height: 52px;
		margin: 0 auto 1rem;
		border-radius: 14px;
		background: rgba(108, 99, 255, 0.12);
		border: 1px solid rgba(108, 99, 255, 0.28);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--dash-accent);
	}

	.checkout-icon-wrap svg {
		width: 26px;
		height: 26px;
	}

	.checkout-eyebrow {
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--dash-text-muted);
		margin-bottom: 0.35rem;
	}

	.checkout-title {
		font-family: var(--font-serif);
		font-size: 1.55rem;
		font-weight: 700;
		color: var(--dash-text);
		letter-spacing: -0.02em;
		margin: 0 0 0.5rem;
		line-height: 1.2;
	}

	.checkout-lead {
		color: var(--dash-text-muted);
		font-size: 0.9rem;
		line-height: 1.55;
		margin: 0 auto 1rem;
		max-width: 22rem;
	}

	.env-pill {
		display: inline-block;
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 0.28rem 0.65rem;
		border-radius: var(--radius-full);
		border: 1px solid transparent;
	}

	.env-pill--sandbox {
		background: rgba(251, 191, 36, 0.1);
		color: #fcd34d;
		border-color: rgba(251, 191, 36, 0.28);
	}

	.env-pill--live {
		background: rgba(34, 197, 94, 0.1);
		color: #86efac;
		border-color: rgba(34, 197, 94, 0.28);
	}

	.checkout-summary {
		background: rgba(0, 0, 0, 0.2);
		border: 1px solid var(--dash-border);
		border-radius: 14px;
		padding: 1.15rem 1.2rem 1rem;
		margin-bottom: 1.25rem;
	}

	.summary-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		padding: 0.55rem 0;
		font-size: 0.88rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.summary-row:last-of-type {
		border-bottom: none;
		padding-bottom: 0;
	}

	.summary-row--stack {
		flex-direction: column;
		gap: 0.4rem;
	}

	.summary-label {
		color: var(--dash-text-muted);
		font-weight: 600;
		flex-shrink: 0;
	}

	.summary-value {
		font-weight: 700;
		color: var(--dash-text);
		text-align: right;
		line-height: 1.35;
	}

	.order-id {
		display: block;
		width: 100%;
		font-family: ui-monospace, monospace;
		font-size: 0.72rem;
		font-weight: 500;
		color: #cbd5e1;
		background: rgba(15, 23, 42, 0.55);
		border: 1px solid rgba(148, 163, 184, 0.2);
		padding: 0.45rem 0.55rem;
		border-radius: 8px;
		word-break: break-all;
		line-height: 1.45;
	}

	.summary-total {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1rem;
		margin-top: 0.85rem;
		padding-top: 1rem;
		border-top: 1px solid rgba(108, 99, 255, 0.2);
	}

	.total-label {
		display: block;
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--dash-text-muted);
		margin-bottom: 0.15rem;
	}

	.total-hint {
		font-size: 0.72rem;
		color: var(--dash-text-muted);
		opacity: 0.85;
	}

	.total-rp {
		font-size: 1.45rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #f1f5f9;
		text-shadow: 0 0 24px rgba(167, 139, 250, 0.35);
	}

	.checkout-trust {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.35rem 0.5rem;
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--dash-text-muted);
		margin-bottom: 1.35rem;
		line-height: 1.4;
	}

	.trust-dot {
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: var(--dash-text-muted);
		opacity: 0.5;
	}

	.checkout-actions {
		text-align: center;
	}

	.checkout-pay-btn {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.15rem;
		position: relative;
		padding: 0.95rem 2.5rem 0.95rem 1.25rem;
		border: none;
		border-radius: 14px;
		cursor: pointer;
		font-family: inherit;
		background: linear-gradient(135deg, var(--dash-accent) 0%, #7c3aed 100%);
		color: #fff;
		box-shadow: 0 8px 28px rgba(108, 99, 255, 0.35);
		border: 1px solid rgba(255, 255, 255, 0.12);
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease;
	}

	.checkout-pay-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 12px 32px rgba(108, 99, 255, 0.42);
	}

	.checkout-pay-btn:active {
		transform: translateY(0);
	}

	.checkout-pay-btn__label {
		font-size: 1rem;
		font-weight: 800;
		letter-spacing: -0.01em;
	}

	.checkout-pay-btn__hint {
		font-size: 0.72rem;
		font-weight: 500;
		opacity: 0.9;
	}

	.checkout-pay-btn__chev {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		width: 22px;
		height: 22px;
		opacity: 0.9;
	}

	.checkout-help {
		margin: 1rem 0 0;
		font-size: 0.78rem;
		line-height: 1.5;
		color: var(--dash-text-muted);
		max-width: 26rem;
		margin-left: auto;
		margin-right: auto;
	}

	.error-state {
		text-align: center;
		padding: 1.5rem 0.5rem 1rem;
		position: relative;
	}

	.error-icon {
		width: 48px;
		height: 48px;
		margin: 0 auto 1rem;
		border-radius: 50%;
		background: rgba(248, 113, 113, 0.12);
		border: 1px solid rgba(248, 113, 113, 0.3);
		color: #fca5a5;
		font-weight: 800;
		font-size: 1.35rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.error-state h3 {
		font-family: var(--font-serif);
		font-size: 1.25rem;
		color: var(--dash-text);
		margin: 0 0 0.65rem;
	}

	.error-copy {
		font-size: 0.88rem;
		line-height: 1.55;
		color: var(--dash-text-muted);
		margin: 0 0 1.5rem;
		text-align: left;
		max-width: 100%;
		padding: 0.85rem 1rem;
		background: rgba(0, 0, 0, 0.15);
		border-radius: 10px;
		border: 1px solid var(--dash-border);
	}

	.checkout-back-btn {
		min-width: 12rem;
	}
</style>
