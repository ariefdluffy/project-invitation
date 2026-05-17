<script lang="ts">
	import type { PageData } from "./$types";
	let { data }: { data: PageData } = $props();

	let scrollY = $state(0);
	let visible = $state(false);
	let iframeLoaded = $state<Record<number, boolean>>({});

	function onThumbLoad(id: number) {
		iframeLoaded[id] = true;
	}

	$effect(() => {
		visible = true;
	});

	const features = [
		{
			icon: "✨",
			title: "Desain Premium",
			desc: "Template elegan yang dirancang dengan penuh cinta dan perhatian detail.",
		},
		{
			icon: "📱",
			title: "Responsive",
			desc: "Tampil sempurna di semua perangkat, dari smartphone hingga desktop.",
		},
		{
			icon: "🎵",
			title: "Musik & Animasi",
			desc: "Tambahkan musik latar dan animasi smooth untuk pengalaman yang memorable.",
		},
		{
			icon: "💌",
			title: "RSVP Online",
			desc: "Kelola daftar tamu dan ucapan selamat secara digital.",
		},
		{
			icon: "🎨",
			title: "Kustomisasi",
			desc: "Sesuaikan warna, font, dan konten sesuai keinginanmu.",
		},
		{
			icon: "📍",
			title: "Integrasi Maps",
			desc: "Lokasi acara terintegrasi dengan Google Maps.",
		},
	];
</script>

<svelte:head>
	<title>{data.appName} - Buat Undangan Digital Premium</title>
	<meta
		name="description"
		content="Buat undangan pernikahan digital yang modern, elegan, dan mudah dibagikan dengan {data.appName}. Pilih dari berbagai template premium."
	/>
</svelte:head>

<svelte:window bind:scrollY />

<!-- Navbar -->
<nav class="navbar" class:scrolled={scrollY > 50}>
	<div class="nav-container">
		<a href="/" class="nav-logo">{data.appName}</a>
		<div class="nav-links">
			<a href="#templates">Template</a>
			<a href="#features">Fitur</a>
			{#if data.user}
				<a
					href={data.user.role === "admin" ? "/admin" : "/dashboard"}
					class="nav-btn">Dashboard</a
				>
			{:else}
				<a href="/login" class="nav-btn">Masuk</a>
			{/if}
		</div>
	</div>
</nav>

<!-- Hero Section -->
<section class="hero" class:visible>
	<div class="hero-particles">
		{#each Array(20) as _, i}
			<div
				class="particle"
				style="--delay: {i * 0.3}s; --x: {Math.random() *
					100}%; --y: {Math.random() * 100}%; --size: {2 +
					Math.random() * 4}px"
			></div>
		{/each}
	</div>
	<div class="hero-content">
		<span class="hero-badge">✨ Platform Undangan Digital #1</span>
		<h1 class="hero-title">
			Buat Undangan Pernikahan
			<span class="hero-gradient">Digital yang Memukau</span>
		</h1>
		<p class="hero-subtitle">
			Wujudkan momen spesialmu dengan undangan digital yang modern,
			elegan, dan mudah dibagikan ke seluruh tamu undangan.
		</p>
		<div class="hero-actions">
			<a href="/register" class="hero-btn primary">
				Mulai Buat Undangan
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg
				>
			</a>
			<a href="#templates" class="hero-btn secondary">Lihat Template</a>
		</div>
		<div class="hero-stats">
			<div class="stat-item">
				<span class="stat-number">1000+</span>
				<span class="stat-label">Undangan Dibuat</span>
			</div>
			<div class="stat-divider"></div>
			<div class="stat-item">
				<span class="stat-number">{data.templates.length}</span>
				<span class="stat-label">Template Premium</span>
			</div>
			<div class="stat-divider"></div>
			<div class="stat-item">
				<span class="stat-number">100%</span>
				<span class="stat-label">Murah</span>
			</div>
		</div>
	</div>
	<div class="hero-visual">
		<div class="phone-mockup">
			<div class="phone-screen">
				<div class="mockup-header">
					<span class="mockup-label">THE WEDDING OF</span>
					<span class="mockup-names">Indri & Adi</span>
					<span class="mockup-date">04 . 04 . 2026</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Templates Section -->
<section id="templates" class="templates-section">
	<div class="section-container">
		<span class="section-badge">Template</span>
		<h2 class="section-title">Pilih Template Favoritmu</h2>
		<p class="section-subtitle">
			Setiap template dirancang khusus oleh designer profesional untuk
			momen spesialmu
		</p>

		<div class="templates-grid">
			{#each data.templates as template, i}
				<div class="template-card" style="animation-delay: {i * 0.15}s">
					<!-- Live iframe thumbnail -->
					<div class="template-thumb-container">
						{#if !iframeLoaded[template.id]}
							<div class="thumb-skeleton">
								<div class="thumb-shimmer"></div>
								<span class="thumb-skeleton-label">Memuat…</span>
							</div>
						{/if}
						<iframe
							src="/demo/{template.id}"
							title="Preview {template.name}"
							class="thumb-iframe"
							class:thumb-loaded={iframeLoaded[template.id]}
							loading="lazy"
							scrolling="no"
							tabindex="-1"
							aria-hidden="true"
							onload={() => onThumbLoad(template.id)}
						></iframe>
						<!-- Overlay blocks clicks & shows CTA on hover -->
						<div class="template-overlay">
							<a href="/register" class="btn btn-primary">Gunakan Template</a>
						</div>
					</div>
					<div class="template-info">
						<h3>{template.name}</h3>
						<p>{template.description}</p>
						<div class="template-colors">
							{#if template.primary_color}
								<span class="color-dot" style="background:{template.primary_color}" title="Primary"></span>
							{/if}
							{#if template.secondary_color}
								<span class="color-dot" style="background:{template.secondary_color}" title="Secondary"></span>
							{/if}
							{#if template.accent_color}
								<span class="color-dot" style="background:{template.accent_color};border:1px solid #ddd" title="Accent"></span>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Features Section -->
<section id="features" class="features-section">
	<div class="section-container">
		<span class="section-badge">Fitur</span>
		<h2 class="section-title">Semua yang Kamu Butuhkan</h2>
		<p class="section-subtitle">
			Fitur lengkap untuk membuat undangan pernikahan digital yang
			sempurna
		</p>

		<div class="features-grid">
			{#each features as feature, i}
				<div class="feature-card" style="animation-delay: {i * 0.1}s">
					<div class="feature-icon">{feature.icon}</div>
					<h3>{feature.title}</h3>
					<p>{feature.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Pricing Section -->
<section id="pricing" class="pricing-section">
	<div class="section-container">
		<div class="pricing-layout">
			<!-- Left Side: Caption -->
			<div class="pricing-caption">
				<span class="section-badge">Paket Berlangganan</span>
				<h2 class="section-title">Harga Terjangkau untuk Semua</h2>
				<p class="section-subtitle">
					Akses premium dengan harga yang ramah di kantong. Dapatkan semua fitur undangan digital terbaik untuk momen spesial Anda.
				</p>
				<div class="pricing-highlights">
					<div class="highlight-item">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
							<polyline points="22 4 12 14.01 9 11.01"/>
						</svg>
						<span>Trial gratis 3 hari (1 undangan, 50 tamu)</span>
					</div>
					<div class="highlight-item">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
							<polyline points="22 4 12 14.01 9 11.01"/>
						</svg>
						<span>Tanpa biaya tersembunyi</span>
					</div>
					<div class="highlight-item">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
							<polyline points="22 4 12 14.01 9 11.01"/>
						</svg>
						<span>Support 24/7</span>
					</div>
				</div>
				<p class="pricing-note">
					* Pembayaran bulanan. Add-on tamu mengikuti masa aktif premium.
				</p>
			</div>

			<!-- Right Side: Pricing Card -->
			<div class="pricing-card-wrapper">
				<div class="pricing-card featured">
					<div class="pricing-badge">Paket Premium</div>
					<h3 class="pricing-name">Premium</h3>
					<div class="pricing-price">
						<span class="price-amount">Rp 39.000</span>
						<span class="price-period">/ bulan</span>
					</div>
					<p class="pricing-desc">Akses penuh ke semua fitur undangan digital dengan 5 undangan dan 100 tamu</p>
					<ul class="pricing-features">
						<li>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
							Buat hingga 5 undangan
						</li>
						<li>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
							Kuota 100 tamu per akun
						</li>
						<li>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
							RSVP & ucapan online
						</li>
						<li>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
							Upload foto & galeri
						</li>
						<li>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
							Integrasi Google Maps
						</li>
						<li>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
							Musik latar & animasi
						</li>
					</ul>
					<div class="pricing-addon">
						<strong>Add-on Tersedia:</strong>
						<p>+ Rp 19.000 untuk tambahan 50 tamu</p>
					</div>
					<a href="/register" class="pricing-btn primary">
						Mulai Berlangganan
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="cta-section">
	<div class="cta-bg">
		{#each Array(6) as _, i}
			<div
				class="cta-ring"
				style="--delay: {i * 0.5}s; --size: {200 + i * 100}px"
			></div>
		{/each}
	</div>
	<div class="section-container cta-content">
		<h2>Siap Membuat Undangan Impianmu?</h2>
		<p>
			Mulai buat undangan pernikahan digital yang memukau dalam hitungan
			menit
		</p>
		<a href="/register" class="hero-btn primary">
			Buat Undangan Sekarang
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg
			>
		</a>
	</div>
</section>

<!-- Footer -->
<footer class="footer">
	<div class="section-container">
		<div class="footer-content">
			<div class="footer-brand">
				<span class="footer-logo">{data.appName}</span>
				<p>
					Platform undangan pernikahan digital terbaik di Indonesia.
				</p>
			</div>
			<div class="footer-links">
				<a href="#templates">Template</a>
				<a href="#features">Fitur</a>
				<a href="/login">Masuk</a>
				<a href="/register">Daftar</a>
			</div>
		</div>
		<div class="footer-bottom">
			<p>&copy; 2026 {data.appName}. All rights reserved.</p>
		</div>
	</div>
</footer>

<style>
	/* Navbar */
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		padding: 1.2rem 0;
		transition: all 0.4s ease;
	}
	.navbar.scrolled {
		background: rgba(15, 15, 26, 0.95);
		backdrop-filter: blur(20px);
		padding: 0.8rem 0;
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
	}
	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.nav-logo {
		font-family: "Great Vibes", cursive;
		font-size: 1.8rem;
		color: white;
		text-shadow: 0 0 20px rgba(108, 99, 255, 0.5);
	}
	.nav-links {
		display: flex;
		align-items: center;
		gap: 2rem;
	}
	.nav-links a {
		color: rgba(255, 255, 255, 0.8);
		font-weight: 500;
		font-size: 0.9rem;
		transition: color 0.3s;
	}
	.nav-links a:hover {
		color: white;
	}
	.nav-btn {
		background: linear-gradient(135deg, #6c63ff, #a78bfa) !important;
		color: white !important;
		padding: 0.5rem 1.2rem;
		border-radius: 8px;
	}

	/* Hero */
	.hero {
		min-height: 100vh;
		display: flex;
		align-items: center;
		background: linear-gradient(
			135deg,
			#0f0f1a 0%,
			#1a1a2e 50%,
			#16213e 100%
		);
		position: relative;
		overflow: hidden;
		padding: 6rem 1.5rem 4rem;
	}
	.hero-particles {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}
	.particle {
		position: absolute;
		width: var(--size);
		height: var(--size);
		background: rgba(108, 99, 255, 0.3);
		border-radius: 50%;
		left: var(--x);
		top: var(--y);
		animation: float 6s ease-in-out infinite;
		animation-delay: var(--delay);
	}
	.hero-content {
		max-width: 1200px;
		margin: 0 auto;
		flex: 1;
		z-index: 2;
		opacity: 0;
		transform: translateY(30px);
		transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.hero.visible .hero-content {
		opacity: 1;
		transform: translateY(0);
	}
	.hero-badge {
		display: inline-block;
		background: rgba(108, 99, 255, 0.15);
		border: 1px solid rgba(108, 99, 255, 0.3);
		color: #a78bfa;
		padding: 0.4rem 1rem;
		border-radius: 50px;
		font-size: 0.85rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
	}
	.hero-title {
		font-family: "Playfair Display", serif;
		font-size: clamp(2rem, 5vw, 3.5rem);
		color: white;
		line-height: 1.2;
		margin-bottom: 1.5rem;
	}
	.hero-gradient {
		display: block;
		background: linear-gradient(135deg, #6c63ff, #a78bfa, #ddd6fe);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	.hero-subtitle {
		font-size: 1.1rem;
		color: rgba(255, 255, 255, 0.6);
		max-width: 520px;
		line-height: 1.7;
		margin-bottom: 2rem;
	}
	.hero-actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 3rem;
	}
	.hero-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.85rem 1.8rem;
		border-radius: 10px;
		font-weight: 600;
		font-size: 0.95rem;
		transition: all 0.3s;
	}
	.hero-btn.primary {
		background: linear-gradient(135deg, #6c63ff, #7c74ff);
		color: white;
		box-shadow: 0 4px 20px rgba(108, 99, 255, 0.4);
	}
	.hero-btn.primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 30px rgba(108, 99, 255, 0.5);
	}
	.hero-btn.secondary {
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
	}
	.hero-btn.secondary:hover {
		border-color: rgba(255, 255, 255, 0.4);
		background: rgba(255, 255, 255, 0.05);
	}
	.hero-stats {
		display: flex;
		align-items: center;
		gap: 2rem;
	}
	.stat-item {
		display: flex;
		flex-direction: column;
	}
	.stat-number {
		font-size: 1.8rem;
		font-weight: 700;
		color: white;
		font-family: "Playfair Display", serif;
	}
	.stat-label {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.5);
	}
	.stat-divider {
		width: 1px;
		height: 40px;
		background: rgba(255, 255, 255, 0.15);
	}
	.hero-visual {
		flex: 0 0 auto;
		z-index: 2;
		display: none;
	}
	.phone-mockup {
		width: 280px;
		height: 560px;
		background: #1a1a2e;
		border-radius: 36px;
		border: 3px solid rgba(108, 99, 255, 0.3);
		padding: 12px;
		box-shadow: 0 20px 60px rgba(108, 99, 255, 0.2);
		animation: float 6s ease-in-out infinite;
	}
	.phone-screen {
		width: 100%;
		height: 100%;
		background: linear-gradient(180deg, #8b6914, #d4a574);
		border-radius: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.mockup-header {
		text-align: center;
		color: #fdf6e3;
	}
	.mockup-label {
		display: block;
		font-size: 0.7rem;
		letter-spacing: 3px;
		opacity: 0.8;
		margin-bottom: 0.5rem;
	}
	.mockup-names {
		display: block;
		font-family: "Great Vibes", cursive;
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}
	.mockup-date {
		font-size: 0.8rem;
		letter-spacing: 4px;
		opacity: 0.7;
	}

	@media (min-width: 900px) {
		.hero {
			padding: 0 3rem;
		}
		.hero-content {
			flex: 1;
		}
		.hero-visual {
			display: block;
		}
	}

	/* Sections */
	.section-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}
	.section-badge {
		display: inline-block;
		background: linear-gradient(135deg, #6c63ff, #a78bfa);
		color: white;
		padding: 0.3rem 1rem;
		border-radius: 50px;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1px;
		margin-bottom: 1rem;
	}
	.section-title {
		font-family: "Playfair Display", serif;
		font-size: clamp(1.5rem, 3vw, 2.5rem);
		color: var(--color-text);
		margin-bottom: 0.75rem;
	}
	.section-subtitle {
		color: var(--color-text-light);
		font-size: 1.05rem;
		max-width: 550px;
		margin: 0 auto 3rem;
	}

	/* Templates */
	.templates-section {
		padding: 6rem 0;
		text-align: center;
		background: var(--color-light);
	}
	.templates-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}
	.template-card {
		background: white;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		animation: fadeInUp 0.6s ease both;
	}
	.template-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
	}

	/* ── Iframe thumbnail (mirrors dashboard/create) ── */
	.template-thumb-container {
		height: 240px;
		position: relative;
		overflow: hidden;
		background: #0d0d1a;
		flex-shrink: 0;
	}
	.thumb-skeleton {
		position: absolute;
		inset: 0;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		background: #0d0d1a;
	}
	.thumb-shimmer {
		width: 55%;
		height: 7px;
		border-radius: 999px;
		background: linear-gradient(90deg, #1a1a2e 25%, #2a2a4a 50%, #1a1a2e 75%);
		background-size: 200% 100%;
		animation: thumbShimmer 1.4s infinite;
	}
	@keyframes thumbShimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}
	.thumb-skeleton-label {
		font-size: 0.65rem;
		color: #8888aa;
	}
	.thumb-iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 1280px;
		height: 900px;
		border: none;
		transform-origin: top left;
		transform: scale(0.235);
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.4s ease;
	}
	@media (max-width: 1280px) {
		.thumb-iframe { transform: scale(0.27); }
	}
	@media (max-width: 900px) {
		.thumb-iframe { transform: scale(0.38); }
	}
	@media (max-width: 560px) {
		.thumb-iframe { transform: scale(0.55); }
	}
	.thumb-iframe.thumb-loaded {
		opacity: 1;
	}
	.template-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.3s;
		z-index: 3;
	}
	.template-card:hover .template-overlay {
		opacity: 1;
	}

	/* ── Info bar below thumbnail ── */
	.template-info {
		padding: 1.25rem 1.5rem;
		text-align: left;
	}
	.template-info h3 {
		font-family: "Playfair Display", serif;
		font-size: 1.1rem;
		margin-bottom: 0.35rem;
		color: #1a1a2e;
	}
	.template-info p {
		color: var(--color-text-light);
		font-size: 0.85rem;
		line-height: 1.5;
		margin-bottom: 0.75rem;
	}
	.template-colors {
		display: flex;
		gap: 6px;
	}
	.color-dot {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		display: inline-block;
	}

	/* Features */
	.features-section {
		padding: 6rem 0;
		background: white;
		text-align: center;
	}
	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}
	.feature-card {
		padding: 2rem;
		border-radius: 16px;
		border: 1px solid var(--color-border);
		text-align: left;
		transition: all 0.3s;
		animation: fadeInUp 0.6s ease both;
	}
	.feature-card:hover {
		border-color: #6c63ff;
		box-shadow: 0 8px 30px rgba(108, 99, 255, 0.1);
		transform: translateY(-4px);
	}
	.feature-icon {
		font-size: 2rem;
		margin-bottom: 1rem;
	}
	.feature-card h3 {
		font-family: "Playfair Display", serif;
		font-size: 1.15rem;
		margin-bottom: 0.5rem;
	}
	.feature-card p {
		color: var(--color-text-light);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	/* CTA */
	.cta-section {
		padding: 6rem 0;
		background: linear-gradient(135deg, #0f0f1a, #1a1a2e);
		text-align: center;
		position: relative;
		overflow: hidden;
	}
	.cta-bg {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.cta-ring {
		position: absolute;
		width: var(--size);
		height: var(--size);
		border: 1px solid rgba(108, 99, 255, 0.1);
		border-radius: 50%;
		animation: pulse 4s ease-in-out infinite;
		animation-delay: var(--delay);
	}
	.cta-content {
		position: relative;
		z-index: 2;
	}
	.cta-content h2 {
		font-family: "Playfair Display", serif;
		font-size: clamp(1.5rem, 3vw, 2.5rem);
		color: white;
		margin-bottom: 1rem;
	}
	.cta-content p {
		color: rgba(255, 255, 255, 0.6);
		font-size: 1.05rem;
		margin-bottom: 2rem;
	}

	/* Footer */
	.footer {
		background: #0a0a14;
		color: rgba(255, 255, 255, 0.6);
		padding: 3rem 0 1.5rem;
	}
	.footer-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 2rem;
		margin-bottom: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}
	.footer-logo {
		font-family: "Great Vibes", cursive;
		font-size: 1.5rem;
		color: white;
		display: block;
		margin-bottom: 0.5rem;
	}
	.footer-brand p {
		font-size: 0.9rem;
		max-width: 280px;
	}
	.footer-links {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
	}
	.footer-links a {
		font-size: 0.9rem;
		transition: color 0.3s;
	}
	.footer-links a:hover {
		color: white;
	}
	.footer-bottom {
		text-align: center;
		font-size: 0.85rem;
	}

	/* Pricing */
	.pricing-section {
		padding: 6rem 0;
		background: linear-gradient(180deg, #f8f9ff 0%, white 100%);
	}
	.pricing-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: 3rem;
		align-items: center;
	}
	.pricing-caption {
		text-align: left;
	}
	.pricing-caption .section-badge {
		margin: 0;
	}
	.pricing-caption .section-title {
		text-align: left;
		margin: 1rem 0;
	}
	.pricing-caption .section-subtitle {
		text-align: left;
		margin: 1rem 0 2rem;
	}
	.pricing-highlights {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 2rem 0;
	}
	.highlight-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--color-text);
		font-size: 0.95rem;
	}
	.highlight-item svg {
		width: 20px;
		height: 20px;
		color: var(--color-primary);
		flex-shrink: 0;
	}
	.pricing-card-wrapper {
		display: flex;
		justify-content: center;
	}

	@media (min-width: 900px) {
		.pricing-layout {
			grid-template-columns: 1fr 1fr;
			gap: 4rem;
		}
	}

	.pricing-card {
		background: white;
		border-radius: 20px;
		padding: 2rem;
		border: 2px solid var(--color-border);
		position: relative;
		transition: all 0.3s;
		text-align: left;
		max-width: 420px;
		width: 100%;
	}
	.pricing-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 20px 40px rgba(108, 99, 255, 0.15);
	}
	.pricing-card.featured {
		border-color: var(--color-primary);
		box-shadow: 0 10px 30px rgba(108, 99, 255, 0.2);
	}
	.pricing-badge {
		position: absolute;
		top: -12px;
		left: 50%;
		transform: translateX(-50%);
		background: linear-gradient(135deg, #6c63ff, #a78bfa);
		color: white;
		padding: 0.4rem 1rem;
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: 600;
		white-space: nowrap;
	}
	.pricing-name {
		font-family: "Playfair Display", serif;
		font-size: 1.5rem;
		margin: 0.5rem 0 1rem;
	}
	.pricing-price {
		margin-bottom: 0.5rem;
	}

	.price-amount {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--color-text);
	}
	.price-period {
		font-size: 1rem;
		color: var(--color-text-light);
	}
	.pricing-desc {
		color: var(--color-text-light);
		margin-bottom: 1.5rem;
	}
	.pricing-features {
		list-style: none;
		padding: 0;
		margin: 0 0 2rem;
	}
	.pricing-features li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0;
		font-size: 0.9rem;
		color: var(--color-text);
	}
	.pricing-features svg {
		width: 18px;
		height: 18px;
		color: var(--color-primary);
		flex-shrink: 0;
	}
	.pricing-addon {
		background: var(--color-bg);
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		border-left: 3px solid var(--color-primary);
	}
	.pricing-addon strong {
		display: block;
		margin-bottom: 0.25rem;
		color: var(--color-text);
		font-size: 0.9rem;
	}
	.pricing-addon p {
		margin: 0;
		color: var(--color-text-light);
		font-size: 0.85rem;
	}
	.pricing-btn {
		display: block;
		width: 100%;
		padding: 1rem;
		text-align: center;
		background: var(--color-bg);
		border: 2px solid var(--color-primary);
		border-radius: 12px;
		font-weight: 600;
		transition: all 0.3s;
		color: var(--color-primary);
	}
	.pricing-btn:hover {
		background: var(--color-primary);
		color: white;
	}
	.pricing-btn.primary {
		background: var(--color-primary);
		color: white;
	}
	.pricing-btn.primary:hover {
		background: #5a52e0;
	}
	.pricing-note {
		text-align: left;
		margin-top: 2rem;
		font-size: 0.85rem;
		color: var(--color-text-light);
	}
	.pricing-caption .pricing-note {
		margin-top: 2rem;
	}

</style>
