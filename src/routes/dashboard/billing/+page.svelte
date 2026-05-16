<script lang="ts">
	import type { PageData } from "./$types";
	import { onMount } from 'svelte';
	import { toast } from '$lib/toast.svelte';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	const statusTone = $derived(
		data.user?.payment_status === "paid"
			? "paid"
			: data.user?.payment_status === "pending"
				? "pending"
				: data.user?.payment_status === "inactive"
					? "inactive"
					: "unpaid",
	);

	onMount(() => {
		// Check for success parameter in URL
		const urlParams = new URLSearchParams(window.location.search);
		const success = urlParams.get('success');

		if (success === 'free') {
			toast.success('Paket berhasil diaktifkan secara gratis! Selamat menikmati fitur premium.');
			// Clean URL
			goto('/dashboard/billing', { replaceState: true });
		}
	});
</script>

<svelte:head>
	<title>Billing & Akses - {data.appName}</title>
</svelte:head>

<div class="dash-header">
	<div>
		<h1>💳 Billing & Akses</h1>
		<p class="dash-header-sub">Kelola akses pembuatan undangan Anda</p>
	</div>
</div>

<div class="billing-grid">
	<div class="dash-card status-card">
		<header class="status-card__header">
			<p class="status-card__eyebrow">Ringkasan akses</p>
			<h3 class="status-card__title">Status Akun Anda</h3>
			<div class="status-badge status-badge--{statusTone}">
				{#if data.user?.payment_status === "paid"}
					<span class="status-badge__dot" aria-hidden="true"></span>
					Terverifikasi
				{:else if data.user?.payment_status === "pending"}
					<span class="status-badge__dot status-badge__dot--pulse" aria-hidden="true"
					></span>
					Menunggu pembayaran
				{:else if data.user?.payment_status === "inactive"}
					<span class="status-badge__dot" aria-hidden="true"></span>
					Pesanan dibatalkan
				{:else}
					<span class="status-badge__dot" aria-hidden="true"></span>
					Belum aktivasi
				{/if}
			</div>
		</header>

		{#if data.user?.payment_status === "paid"}
			<div class="access-panel access-panel--success">
				<p class="access-panel__text">
					Selamat! Pembayaran Anda telah terverifikasi. Akun Anda memiliki akses penuh untuk membuat
					dan mengelola undangan sesuai paket Anda.
				</p>
				<div class="status-actions">
					<a href="/dashboard/create" class="status-cta status-cta--primary">
						<svg class="status-cta__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
							<circle cx="12" cy="12" r="10" />
							<path d="M12 8v8M8 12h8" />
						</svg>
						<span class="status-cta__copy">
							<span class="status-cta__label">Mulai buat undangan</span>
							<span class="status-cta__hint">Buka halaman editor baru</span>
						</span>
						<svg class="status-cta__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
							<path d="M9 18l6-6-6-6" />
						</svg>
					</a>
				</div>
			</div>
		{:else if data.user?.payment_status === "pending"}
			<div class="access-panel access-panel--warning">
				<p class="access-panel__text">
					Pembayaran sedang diproses. Selesaikan pembayaran QRIS di halaman
					checkout untuk mengaktifkan fitur premium.
				</p>
				<div class="status-actions">
					<a
						href="/dashboard/billing"
						class="status-cta status-cta--primary"
					>
						<svg class="status-cta__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
							<rect x="2" y="5" width="20" height="14" rx="2" />
							<path d="M2 10h20" />
						</svg>
						<span class="status-cta__copy">
							<span class="status-cta__label">Lihat paket</span>
							<span class="status-cta__hint">Pilih paket yang sesuai</span>
						</span>
						<svg class="status-cta__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
							<path d="M9 18l6-6-6-6" />
						</svg>
					</a>
				</div>
			</div>
		{:else}
			<div class="access-panel access-panel--muted">
				<p class="access-panel__text">
					<strong>Akun Trial Gratis:</strong> Anda dapat membuat 1 undangan dengan maksimal 50 tamu selama 3 hari.
					Upgrade ke paket premium untuk membuat hingga 5 undangan dengan 100 tamu.
				</p>
			</div>
		{/if}
	</div>

	{#if data.trialActive}
	<div class="trial-banner">
		<div class="trial-banner__inner">
			<span class="trial-banner__icon">⏳</span>
			<div class="trial-banner__text">
				<span class="trial-banner__title">Masa percobaan aktif</span>
				<span class="trial-banner__sub">
					Akses penuh hingga {new Date(data.trialEndsAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
				</span>
			</div>
		</div>
	</div>
	{/if}

	<!-- Premium Package Card -->
	<div class="dash-card package-card package-card--popular">
		<div class="package-card__content">
			<div class="card-badge">PAKET PREMIUM</div>
			<div class="package-card__header">
				<div class="package-icon-wrapper">
					<span class="package-icon">👑</span>
				</div>
				<span class="plan-name">Premium</span>
			</div>
			<div class="price">
				<span class="currency">Rp</span>
				<span class="amount">{Number(data.premiumPrice).toLocaleString('id-ID')}</span>
				<span class="period">/ bulan</span>
			</div>
			<p class="package-desc">
				Akses penuh ke semua fitur undangan digital dengan <strong>5 undangan</strong> dan <strong>100 tamu</strong>
			</p>
			<ul class="package-features">
				<li>
					<span class="feat-check">✓</span>
					Buat hingga 5 undangan
				</li>
				<li>
					<span class="feat-check">✓</span>
					Kuota 100 tamu per akun
				</li>
				<li>
					<span class="feat-check">✓</span>
					RSVP & ucapan online
				</li>
				<li>
					<span class="feat-check">✓</span>
					Upload foto & galeri
				</li>
				<li>
					<span class="feat-check">✓</span>
					Integrasi Google Maps
				</li>
				<li>
					<span class="feat-check">✓</span>
					Musik latar & animasi
				</li>
			</ul>
			<div class="package-card__action">
				{#if data.user?.payment_status === "paid"}
					<span class="btn btn-secondary btn-lg w-full" style="cursor:default;opacity:0.6;">Sudah Aktif</span>
				{:else}
					<a href="/dashboard/billing/checkout?package=premium" class="btn btn-primary btn-lg w-full">Berlangganan Sekarang</a>
				{/if}
			</div>
			<div class="package-footer">
				<small>⭐ Paket paling populer untuk semua kebutuhan undangan</small>
			</div>
		</div>
	</div>

	<!-- Add-on Guest Card -->
	<div class="dash-card addon-card">
		<div class="addon-card__content">
			<div class="addon-card__header">
				<div class="addon-icon-wrapper">
					<span class="addon-icon">👥</span>
				</div>
				<span class="plan-name">Add-on Tamu</span>
			</div>
			<div class="price">
				<span class="currency">Rp</span>
				<span class="amount">{Number(data.addonGuestPrice).toLocaleString('id-ID')}</span>
				<span class="period">/ paket</span>
			</div>
			<p class="addon-desc">
				Tambah kuota tamu sebanyak <strong>{data.addonGuestQuantity} tamu</strong> per pembelian.
				Masa aktif mengikuti langganan premium Anda.
			</p>
			<div class="addon-card__action">
				{#if data.user?.payment_status === "paid"}
					<a href="/dashboard/billing/checkout?package=addon-guest" class="btn btn-primary btn-lg w-full">Beli Add-on</a>
				{:else}
					<span class="btn btn-secondary btn-lg w-full" style="cursor:default;opacity:0.6;">Aktifkan Premium Dulu</span>
				{/if}
			</div>
			<div class="addon-footer">
				<small>💡 Add-on ini menambah kuota tamu untuk semua undangan Anda</small>
			</div>
		</div>
	</div>

	{#if data.paymentInstructions && data.user?.payment_status !== "paid"}
		<div class="dash-card manual-payment-card">
			<div class="manual-header">
				<div class="manual-icon">💬</div>
				<span class="manual-title">Pembayaran Manual</span>
			</div>

			<p class="manual-desc">
				Lebih memilih transfer langsung? Hubungi kami melalui WhatsApp untuk panduan pembayaran manual.
			</p>

			<div class="payment-info-box">
				<div class="payment-info-header">📋 Instruksi Pembayaran</div>
				<div class="payment-info-content">
					{data.paymentInstructions}
				</div>
			</div>

			<a
				href="https://wa.me/?text=Halo%20Admin%20Undangan%20-%20Saya%20ingin%20melakukan%20pembayaran%20manual.%20Berapa%20cara%20pembayarannya%3F"
				target="_blank"
				rel="noopener noreferrer"
				class="btn btn-whatsapp btn-lg w-full"
			>
				<svg class="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2-59-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.869 1.176l-.348.208-.361-.094-1.386-.238.242 1.402.093.362-.208.355a9.904 9.904 0 00-1.5 4.823 9.93 9.93 0 001.524 5.83c.325.527.656 1.005 1.016 1.447l.33.352-.113.355-1.296 4.117 4.364-1.406.356-.115.351.33c.383.366.886.79 1.527 1.165a9.9 9.9 0 004.824 1.496c5.461 0 9.904-4.442 9.904-9.903 0-2.637-.997-5.119-2.819-6.99-1.822-1.871-4.305-2.902-6.95-2.902" />
				</svg>
				<span>Hubungi via WhatsApp</span>
			</a>

			<p class="manual-notice">
				Kami akan memandu Anda melalui proses pembayaran dengan aman.
			</p>
		</div>
	{/if}
</div>

<style>
	.dash-header-sub {
		color: var(--dash-text-muted);
		font-size: 0.95rem;
		margin-top: 0.25rem;
	}

	.billing-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		max-width: 1200px;
	}

	@media (min-width: 768px) {
		.billing-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 1024px) {
		.billing-grid {
			grid-template-columns: 1fr 1fr 1fr;
		}
	}

	.addon-expansion-group {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.status-card {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		text-align: left;
		padding: 2rem 1.75rem 2.25rem;
		position: relative;
		overflow: hidden;
	}

	.status-card::before {
		content: "";
		position: absolute;
		inset: 0 0 auto 0;
		height: 3px;
		background: linear-gradient(90deg, var(--dash-accent), #a78bfa, #c4b5fd);
		opacity: 0.85;
	}

	.status-card:hover {
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(108, 99, 255, 0.12);
	}

	.status-card__header {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.status-card__eyebrow {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--dash-text-muted);
		margin-bottom: 0.35rem;
	}

	.status-card__title {
		font-size: 1.35rem;
		font-weight: 700;
		color: var(--dash-text);
		letter-spacing: -0.02em;
		margin-bottom: 1rem;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin: 0 auto;
		padding: 0.45rem 1.1rem;
		border-radius: var(--radius-full);
		font-weight: 600;
		font-size: 0.8rem;
		letter-spacing: 0.02em;
		border: 1px solid transparent;
	}

	.status-badge__dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: currentColor;
		opacity: 0.9;
		flex-shrink: 0;
	}

	.status-badge__dot--pulse {
		animation: status-dot-pulse 2s ease-in-out infinite;
	}

	@keyframes status-dot-pulse {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.45;
			transform: scale(0.85);
		}
	}

	.status-badge--paid {
		background: rgba(34, 197, 94, 0.12);
		color: #86efac;
		border-color: rgba(34, 197, 94, 0.28);
	}

	.status-badge--pending {
		background: rgba(251, 191, 36, 0.1);
		color: #fcd34d;
		border-color: rgba(251, 191, 36, 0.28);
	}

	.status-badge--unpaid {
		background: rgba(248, 113, 113, 0.1);
		color: #fca5a5;
		border-color: rgba(248, 113, 113, 0.25);
	}

	.status-badge--inactive {
		background: rgba(148, 163, 184, 0.12);
		color: #cbd5e1;
		border-color: rgba(148, 163, 184, 0.22);
	}

	.access-panel {
		padding: 1.25rem 1.2rem;
		border-radius: var(--radius-md);
		font-size: 0.92rem;
		line-height: 1.65;
		border: 1px solid transparent;
	}

	.access-panel__text {
		margin: 0 0 1.25rem;
		color: var(--dash-text-muted);
	}

	.access-panel--success {
		background: rgba(34, 197, 94, 0.06);
		border-color: rgba(34, 197, 94, 0.18);
	}

	.access-panel--success .access-panel__text {
		color: #b6e4c5;
	}

	.access-panel--warning {
		background: rgba(251, 191, 36, 0.06);
		border-color: rgba(251, 191, 36, 0.2);
	}

	.access-panel--warning .access-panel__text {
		color: #fde68a;
	}

	.access-panel--muted {
		background: rgba(136, 136, 170, 0.06);
		border-color: var(--dash-border);
	}

	.status-actions {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.status-actions__form {
		margin: 0;
	}

	.status-cta {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		width: 100%;
		min-height: 3.25rem;
		padding: 0.75rem 1rem;
		border-radius: 14px;
		font-family: inherit;
		font-weight: 600;
		font-size: 0.9rem;
		text-decoration: none;
		text-align: left;
		cursor: pointer;
		border: none;
		transition:
			transform var(--transition-fast),
			box-shadow var(--transition-fast),
			background var(--transition-fast),
			border-color var(--transition-fast),
			color var(--transition-fast);
	}

	.status-cta--primary {
		background: linear-gradient(135deg, var(--dash-accent) 0%, #8b5cf6 100%);
		color: #fff;
		box-shadow: 0 4px 14px rgba(108, 99, 255, 0.35);
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.status-cta--primary:hover {
		transform: translateY(-1px);
		box-shadow: 0 8px 24px rgba(108, 99, 255, 0.45);
	}

	.status-cta--primary:active {
		transform: translateY(0);
	}

	.status-cta--ghost {
		justify-content: center;
		background: rgba(255, 255, 255, 0.03);
		color: var(--dash-text-muted);
		border: 1px solid var(--dash-border);
		box-shadow: none;
	}

	.status-cta--ghost .status-cta__copy {
		flex: 0 1 auto;
	}

	.status-cta--ghost:hover {
		color: var(--dash-text);
		border-color: rgba(108, 99, 255, 0.35);
		background: rgba(108, 99, 255, 0.06);
	}

	.status-cta__icon {
		width: 22px;
		height: 22px;
		flex-shrink: 0;
		opacity: 0.95;
	}

	.status-cta__chevron {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		margin-left: auto;
		opacity: 0.75;
	}

	.status-cta--primary .status-cta__chevron {
		opacity: 0.9;
	}

	.status-cta__copy {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		min-width: 0;
		flex: 1;
	}

	.status-cta__copy--single {
		flex-direction: row;
		align-items: center;
		justify-content: center;
		text-align: center;
		width: 100%;
	}

	.status-cta__label {
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		line-height: 1.25;
	}

	.status-cta__hint {
		font-size: 0.72rem;
		font-weight: 500;
		opacity: 0.88;
		line-height: 1.3;
	}

	.status-cta--ghost .status-cta__label {
		font-size: 0.85rem;
		font-weight: 600;
	}

	.pricing-card {
		padding: 3.5rem 2.5rem 3rem;
		background: linear-gradient(145deg, #ffffff 0%, #f5f3ff 100%);
		border: 2px solid #ddd6fe;
		position: relative;
		overflow: hidden;
		box-shadow: 0 20px 40px rgba(108, 99, 255, 0.08);
	}

	.card-badge {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
		color: white;
		padding: 0.35rem 0.85rem;
		border-radius: 20px;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
	}

	.price-header {
		margin-bottom: 2rem;
	}

	.plan-name {
		font-weight: 700;
		color: var(--dash-accent);
		text-transform: uppercase;
		letter-spacing: 1px;
		font-size: 0.8rem;
	}

	.price {
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
		margin-top: 0.5rem;
	}

	.amount {
		font-size: 3.5rem;
		font-weight: 800;
		color: #0f172a;
		letter-spacing: -1px;
	}

	.currency {
		font-weight: 800;
		font-size: 1.4rem;
		color: #0f172a;
	}

	.period {
		color: var(--dash-text-muted);
		font-size: 0.9rem;
	}

	.features {
		list-style: none;
		padding: 0;
		margin: 0 0 2.5rem 0;
	}

	.features li {
		margin-bottom: 1rem;
		font-size: 0.95rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: #475569;
		font-weight: 500;
	}

	.feat-icon {
		font-size: 1.1rem;
		filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
	}

	.payment-methods {
		margin-bottom: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--dash-border);
	}

	.payment-methods h4 {
		font-size: 0.85rem;
		color: #64748b;
		margin-bottom: 1rem;
	}

	.method-icons {
		display: flex;
		gap: 1rem;
		font-weight: 700;
		color: #475569;
		font-size: 0.75rem;
	}

	.w-full {
		width: 100%;
	}

	.secure-notice {
		text-align: center;
		font-size: 0.75rem;
		color: #64748b;
		margin-top: 1rem;
	}
	.addon-card {
		padding: 2.5rem 2rem 2rem;
		border: 1px solid rgba(108, 99, 255, 0.15);
		background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
		box-shadow: 0 4px 20px rgba(108, 99, 255, 0.1);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: 16px;
		position: relative;
		text-align: center;
	}

	.addon-card::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
	}

	.addon-card__content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		flex: 1;
	}

	.addon-card__header {
		text-align: center;
	}

	.addon-icon-wrapper {
		width: 64px;
		height: 64px;
		margin: 0 auto 1rem;
		background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
	}

	.addon-icon {
		font-size: 2rem;
		margin: 0;
	}

	.addon-card .plan-name {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #6366f1;
		margin-bottom: 0.5rem;
		display: block;
	}

	.addon-card .price {
		justify-content: center;
		margin-top: 0.75rem;
	}

	.addon-card .currency {
		font-size: 1.2rem;
		color: #1e293b;
	}

	.addon-card .amount {
		font-size: 2.5rem;
		color: #1e293b;
		font-weight: 800;
		letter-spacing: -1px;
	}

	.addon-card .period {
		font-size: 0.9rem;
		color: #64748b;
	}

	.addon-desc {
		color: #475569;
		font-size: 0.95rem;
		line-height: 1.6;
		text-align: center;
		margin: 0;
	}

	.current-limit-box {
		background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
		padding: 1.25rem 1.5rem;
		border-radius: 12px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border: 1px solid #e2e8f0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}

	.limit-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.limit-label {
		font-size: 0.8rem;
		font-weight: 600;
		color: #475569;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.limit-sub {
		font-size: 0.72rem;
		color: #94a3b8;
	}

	.limit-val {
		font-size: 1.75rem;
		font-weight: 800;
		background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.addon-card__action {
		margin-top: auto;
	}

	.addon-card .btn-primary {
		background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
		box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
	}

	.addon-card .btn-primary:hover {
		box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
		transform: translateY(-1px);
	}

	.addon-footer {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid rgba(99, 102, 241, 0.1);
		font-size: 0.8rem;
		color: #64748b;
		font-weight: 500;
	}

	/* Template Expansion Card Styles */
	.template-expansion-card {
		padding: 0;
		border: none;
		background: linear-gradient(135deg, rgba(167, 139, 250, 0.05) 0%, rgba(186, 85, 211, 0.02) 100%);
		box-shadow: 0 4px 20px rgba(167, 139, 250, 0.1);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: 16px;
		position: relative;
	}
	.template-expansion-card::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(135deg, #a78bfa 0%, #ba55d3 50%, #d8b4fe 100%);
	}

	.template-expansion-card__content {
		padding: 2.5rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.template-expansion-card__header {
		text-align: center;
	}

	.template-expansion-icon-wrapper {
		width: 80px;
		height: 80px;
		border-radius: 20px;
		background: linear-gradient(135deg, #a78bfa 0%, #ba55d3 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 1.25rem;
		box-shadow: 0 8px 24px rgba(167, 139, 250, 0.3);
	}

	.template-expansion-icon {
		font-size: 2.5rem;
	}

	.template-expansion-card .plan-name {
		font-size: 0.75rem;
		font-weight: 700;
		color: #a78bfa;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 0.5rem;
		display: block;
	}

	.template-expansion-card .price {
		justify-content: center;
		margin-top: 0.75rem;
	}

	.template-expansion-card .currency {
		font-size: 1.2rem;
		color: #1e293b;
	}

	.template-expansion-card .amount {
		font-size: 3rem;
		color: #1e293b;
	}

	.template-expansion-card .period {
		font-size: 0.9rem;
		color: #64748b;
	}

	.template-expansion-desc {
		font-size: 0.95rem;
		line-height: 1.6;
		color: #475569;
		text-align: center;
		margin: 0;
	}

	.current-quota-box {
		background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
		padding: 1.25rem 1.5rem;
		border-radius: 12px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border: 1px solid #e2e8f0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}

	.quota-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.quota-label {
		font-size: 0.8rem;
		font-weight: 600;
		color: #475569;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.quota-sub {
		font-size: 0.72rem;
		color: #94a3b8;
	}

	.quota-val {
		font-size: 1.75rem;
		font-weight: 800;
		background: linear-gradient(135deg, #a78bfa 0%, #ba55d3 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.template-expansion-card .btn-primary {
		background: linear-gradient(135deg, #a78bfa 0%, #ba55d3 100%);
		box-shadow: 0 4px 14px rgba(167, 139, 250, 0.35);
	}

	.template-expansion-card .btn-primary:hover {
		box-shadow: 0 6px 20px rgba(167, 139, 250, 0.45);
		transform: translateY(-1px);
	}

	.template-expansion-footer {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 1.5rem;
		background: rgba(167, 139, 250, 0.04);
		border-top: 1px solid rgba(167, 139, 250, 0.1);
		font-size: 0.8rem;
		color: #64748b;
		font-weight: 500;
	}

	.manual-payment-card {
		padding: 2.5rem 2rem;
		border: 1px solid rgba(34, 197, 94, 0.2);
		background: linear-gradient(145deg, #f0fdf4, #fefeff);
		box-shadow: 0 10px 25px rgba(34, 197, 94, 0.05);
		display: flex;
		flex-direction: column;
	}

	.manual-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.manual-icon {
		font-size: 2rem;
	}

	.manual-title {
		font-weight: 700;
		font-size: 1.1rem;
		color: #0f172a;
		letter-spacing: -0.01em;
	}

	.manual-desc {
		color: var(--dash-text-muted);
		font-size: 0.95rem;
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	.payment-info-box {
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 1rem;
		margin-bottom: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.payment-info-header {
		font-size: 0.8rem;
		font-weight: 700;
		color: #475569;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.payment-info-content {
		font-size: 0.95rem;
		color: #1e293b;
		line-height: 1.6;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.btn-whatsapp {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		background: linear-gradient(135deg, #25d366 0%, #20ba58 100%);
		color: white;
		border: none;
		font-weight: 700;
		transition:
			transform var(--transition-fast),
			box-shadow var(--transition-fast),
			background var(--transition-fast);
		box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
		text-decoration: none;
		cursor: pointer;
	}

	.btn-whatsapp:hover {
		transform: translateY(-1px);
		box-shadow: 0 8px 24px rgba(37, 211, 102, 0.45);
		background: linear-gradient(135deg, #20ba58 0%, #1da052 100%);
	}

	.btn-whatsapp:active {
		transform: translateY(0);
	}

	.whatsapp-icon {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
	}

	.manual-notice {
			text-align: center;
			font-size: 0.8rem;
			color: #64748b;
			margin-top: 1rem;
		}

		.trial-banner {
			grid-column: 1 / -1;
			background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(251, 191, 36, 0.04));
			border: 1px solid rgba(251, 191, 36, 0.25);
			border-radius: 14px;
			overflow: hidden;
		}

		.trial-banner__inner {
			display: flex;
			align-items: center;
			gap: 1rem;
			padding: 1rem 1.5rem;
		}

		.trial-banner__icon {
			font-size: 1.8rem;
			flex-shrink: 0;
		}

		.trial-banner__text {
			display: flex;
			flex-direction: column;
			gap: 0.15rem;
		}

		.trial-banner__title {
			font-weight: 700;
			font-size: 0.95rem;
			color: #fde68a;
		}

		.trial-banner__sub {
			font-size: 0.82rem;
			color: var(--dash-text-muted);
		}

		.packages-grid {
			grid-column: 1 / -1;
			display: grid;
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		@media (min-width: 768px) {
			.packages-grid {
				grid-template-columns: repeat(3, 1fr);
			}
		}

		.package-card {
			padding: 2.5rem 2rem 2rem;
			border: 1px solid rgba(108, 99, 255, 0.15);
			background: linear-gradient(135deg, #fff5f8 0%, #fff0f5 100%);
			box-shadow: 0 4px 20px rgba(236, 72, 153, 0.1);
			display: flex;
			flex-direction: column;
			overflow: hidden;
			border-radius: 16px;
			position: relative;
			text-align: center;
		}

		.package-card::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 4px;
			background: linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fb7185 100%);
		}

		.package-card__content {
			display: flex;
			flex-direction: column;
			gap: 1.5rem;
			flex: 1;
		}

		.package-card--popular {
			background: linear-gradient(135deg, #fff5f8 0%, #fff0f5 100%);
			box-shadow: 0 12px 40px rgba(236, 72, 153, 0.15);
		}

		.package-card__header {
			text-align: center;
		}

		.package-icon-wrapper {
			width: 64px;
			height: 64px;
			margin: 0 auto 1rem;
			background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
			border-radius: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 8px 24px rgba(236, 72, 153, 0.3);
		}

		.package-icon {
			font-size: 2rem;
			margin: 0;
		}

		.package-card .plan-name {
			font-size: 0.75rem;
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.08em;
			color: #ec4899;
			margin-bottom: 0.5rem;
			display: block;
		}

		.package-card .price {
			justify-content: center;
			margin-top: 0.75rem;
		}

		.package-card .currency {
			font-size: 1.2rem;
			color: #1e293b;
		}

		.package-card .amount {
			font-size: 2.5rem;
			color: #1e293b;
			font-weight: 800;
			letter-spacing: -1px;
		}

		.package-card .period {
			font-size: 0.9rem;
			color: #64748b;
		}

		.package-desc {
			color: #475569;
			font-size: 0.95rem;
			line-height: 1.6;
			text-align: center;
			margin: 0;
		}

		.package-features {
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
		}

		.package-features li {
			display: flex;
			align-items: center;
			gap: 0.75rem;
			font-size: 0.88rem;
			color: #475569;
			text-align: left;
		}

		.feat-check {
			width: 20px;
			height: 20px;
			border-radius: 50%;
			background: rgba(236, 72, 153, 0.12);
			color: #ec4899;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.7rem;
			font-weight: 700;
			flex-shrink: 0;
		}

		.package-footer {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 0.5rem;
			margin-top: 1rem;
			padding-top: 1rem;
			border-top: 1px solid rgba(236, 72, 153, 0.1);
			font-size: 0.8rem;
			color: #64748b;
			font-weight: 500;
		}



		.package-card__action {
			margin-top: auto;
		}

		.package-card .btn-primary {
			background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
			box-shadow: 0 4px 14px rgba(236, 72, 153, 0.35);
		}

		.package-card .btn-primary:hover {
			box-shadow: 0 6px 20px rgba(236, 72, 153, 0.45);
			transform: translateY(-1px);
		}
	</style>
