<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// ─── Helpers ─────────────────────────────────────────────────────────
	function formatDate(d: string | null | undefined): string {
		if (!d) return '-';
		try {
			return new Date(d).toLocaleDateString('id-ID', {
				day: 'numeric',
				month: 'short',
				year: 'numeric'
			});
		} catch {
			return '-';
		}
	}

	function formatRelative(d: string | null | undefined): string {
		if (!d) return '-';
		const date = new Date(d);
		if (isNaN(date.getTime())) return '-';
		const diffMs = Date.now() - date.getTime();
		const diffMin = Math.floor(diffMs / 60000);
		if (diffMin < 1) return 'Baru saja';
		if (diffMin < 60) return `${diffMin} menit lalu`;
		const diffH = Math.floor(diffMin / 60);
		if (diffH < 24) return `${diffH} jam lalu`;
		const diffD = Math.floor(diffH / 24);
		if (diffD < 7) return `${diffD} hari lalu`;
		return formatDate(d);
	}

	function formatNumber(n: number): string {
		return new Intl.NumberFormat('id-ID').format(n || 0);
	}

	// ─── Subscription / trial status ─────────────────────────────────────
	const subscriptionDaysLeft = $derived.by(() => {
		const end = data.user?.subscription_ends_at;
		if (!end) return null;
		const diff = new Date(end).getTime() - Date.now();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	});

	const trialDaysLeft = $derived.by(() => {
		const end = data.user?.trial_ends_at;
		if (!end || !data.trialActive) return null;
		const diff = new Date(end).getTime() - Date.now();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	});

	const accountStatus = $derived.by(() => {
		const u = data.user;
		if (!u) return { label: 'Tidak diketahui', tone: 'neutral' };
		if (u.role === 'admin') return { label: 'Administrator', tone: 'info' };
		if (u.payment_status === 'paid') return { label: 'Premium Aktif', tone: 'success' };
		if (u.payment_status === 'pending') return { label: 'Menunggu Pembayaran', tone: 'warning' };
		if (data.trialActive) return { label: 'Trial Aktif', tone: 'info' };
		return { label: 'Belum Aktif', tone: 'danger' };
	});

	// ─── Stats ───────────────────────────────────────────────────────────
	const guestTotal = $derived(data.guestStats?.total ?? 0);
	const attendingPct = $derived(
		guestTotal > 0 ? Math.round((data.guestStats.attending / guestTotal) * 100) : 0
	);
	const notAttendingPct = $derived(
		guestTotal > 0 ? Math.round((data.guestStats.not_attending / guestTotal) * 100) : 0
	);
	const noResponsePct = $derived(
		guestTotal > 0 ? Math.round((data.guestStats.no_response / guestTotal) * 100) : 0
	);

	const stats = $derived([
		{
			label: 'Total Undangan',
			value: data.invitations?.length ?? 0,
			icon: '💌',
			accent: 'cyan',
			sub: data.user?.invitation_limit
				? `dari ${data.user.invitation_limit} kuota`
				: ''
		},
		{
			label: 'Hadir',
			value: data.guestStats?.attending ?? 0,
			icon: '🙋',
			accent: 'green',
			sub: `${attendingPct}% dari total tamu`
		},
		{
			label: 'Tidak Hadir',
			value: data.guestStats?.not_attending ?? 0,
			icon: '🙅',
			accent: 'warm',
			sub: `${notAttendingPct}% dari total tamu`
		},
		{
			label: 'Belum Respon',
			value: data.guestStats?.no_response ?? 0,
			icon: '⏳',
			accent: 'pink',
			sub: `${noResponsePct}% dari total tamu`
		}
	]);

	// ─── Quota ───────────────────────────────────────────────────────────
	const invitationUsed = $derived(data.invitations?.length ?? 0);
	const invitationLimit = $derived(data.user?.invitation_limit ?? 0);
	const invitationPct = $derived(
		invitationLimit > 0
			? Math.min(100, Math.round((invitationUsed / invitationLimit) * 100))
			: 0
	);

	const guestUsed = $derived(data.guestStats?.total ?? 0);
	const guestLimit = $derived(data.user?.guest_limit ?? 0);
	const guestPct = $derived(
		guestLimit > 0 ? Math.min(100, Math.round((guestUsed / guestLimit) * 100)) : 0
	);

	// ─── Sparkline ───────────────────────────────────────────────────────
	const sparkData = $derived.by(() => {
		const days = 14;
		const map = new Map<string, number>();
		for (const row of data.dailyViews ?? []) {
			const key = new Date(row.date).toISOString().slice(0, 10);
			map.set(key, Number(row.count) || 0);
		}
		const out: { date: string; count: number }[] = [];
		for (let i = days - 1; i >= 0; i--) {
			const d = new Date();
			d.setDate(d.getDate() - i);
			const key = d.toISOString().slice(0, 10);
			out.push({ date: key, count: map.get(key) ?? 0 });
		}
		return out;
	});

	const sparkMax = $derived(Math.max(1, ...sparkData.map((d) => d.count)));

	function sparkPath(points: { date: string; count: number }[]): string {
		if (points.length === 0) return '';
		const w = 100;
		const h = 32;
		const step = w / Math.max(1, points.length - 1);
		return points
			.map((p, i) => {
				const x = i * step;
				const y = h - (p.count / sparkMax) * (h - 2) - 1;
				return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
			})
			.join(' ');
	}

	function sparkArea(points: { date: string; count: number }[]): string {
		const line = sparkPath(points);
		if (!line) return '';
		const w = 100;
		const h = 32;
		return `${line} L${w},${h} L0,${h} Z`;
	}
</script>

<svelte:head>
	<title>Dashboard - {data.appName}</title>
</svelte:head>

<!-- ─── HEADER ──────────────────────────────────────────────────────── -->
<div class="dash-header">
	<div>
		<h1>Halo, {data.user.username} 👋</h1>
		<p class="dash-header-sub">Pantau performa undangan & RSVP tamu kamu di sini</p>
	</div>
	<div class="header-actions">
		<a href="/dashboard/billing" class="btn btn-secondary">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<rect x="1" y="4" width="22" height="16" rx="2" />
				<line x1="1" y1="10" x2="23" y2="10" />
			</svg>
			Billing
		</a>
		<a href="/dashboard/create" class="btn btn-primary">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10" />
				<path d="M12 8v8M8 12h8" />
			</svg>
			Buat Undangan
		</a>
	</div>
</div>

<!-- ─── ACCOUNT STATUS BANNER ──────────────────────────────────────── -->
{#if data.user.role !== 'admin' && !data.accountActive}
	<div class="status-banner status-banner--danger">
		<div class="banner-content">
			<span class="banner-icon">⚠️</span>
			<div class="banner-text">
				<strong>Akun belum aktif</strong>
				<p>Aktifkan trial 3 hari gratis atau upgrade ke premium untuk mulai membuat undangan.</p>
			</div>
		</div>
		<a href="/dashboard/billing" class="btn btn-primary btn-sm">Aktivasi Sekarang</a>
	</div>
{:else if data.user.role !== 'admin' && data.user.payment_status === 'pending'}
	<div class="status-banner status-banner--warning">
		<div class="banner-content">
			<span class="banner-icon">⏰</span>
			<div class="banner-text">
				<strong>Pembayaran sedang diproses</strong>
				<p>Kami sedang memverifikasi pembayaranmu. Akses akan otomatis aktif setelah dikonfirmasi.</p>
			</div>
		</div>
		<a href="/dashboard/billing" class="btn btn-secondary btn-sm">Cek Status</a>
	</div>
{:else if data.user.role !== 'admin' && data.trialActive && data.user.payment_status !== 'paid'}
	<div class="status-banner status-banner--info">
		<div class="banner-content">
			<span class="banner-icon">🎁</span>
			<div class="banner-text">
				<strong>Kamu sedang dalam masa trial</strong>
				<p>
					Trial berakhir <strong>{formatDate(data.user.trial_ends_at)}</strong>
					{#if trialDaysLeft !== null}
						({trialDaysLeft} hari lagi)
					{/if}. Upgrade ke premium agar undangan tetap aktif.
				</p>
			</div>
		</div>
		<a href="/dashboard/billing" class="btn btn-primary btn-sm">Upgrade Premium</a>
	</div>
{:else if data.user.role !== 'admin' && data.user.payment_status === 'paid' && subscriptionDaysLeft !== null && subscriptionDaysLeft <= 7}
	<div class="status-banner status-banner--warning">
		<div class="banner-content">
			<span class="banner-icon">🔔</span>
			<div class="banner-text">
				<strong>Langganan akan berakhir</strong>
				<p>
					Premium berakhir <strong>{formatDate(data.user.subscription_ends_at)}</strong>
					({subscriptionDaysLeft} hari lagi). Perpanjang sekarang agar undangan tetap online.
				</p>
			</div>
		</div>
		<a href="/dashboard/billing" class="btn btn-primary btn-sm">Perpanjang</a>
	</div>
{/if}

<!-- ─── STATS GRID ──────────────────────────────────────────────────── -->
<div class="dash-stats">
	{#each stats as stat, i}
		<div
			class="dash-stat dash-stat-accent-{stat.accent}"
			style="animation: fadeInUp 0.5s ease {i * 0.08}s both"
		>
			<div class="stat-top">
				<span class="stat-icon">{stat.icon}</span>
				<h3>{stat.label}</h3>
			</div>
			<div class="value">{formatNumber(stat.value)}</div>
			{#if stat.sub}
				<div class="stat-sub">{stat.sub}</div>
			{/if}
		</div>
	{/each}
</div>

<!-- ─── ANALYTICS + ACCOUNT ─────────────────────────────────────────── -->
<div class="grid-2-1">
	<!-- Analytics card with sparkline -->
	<div class="dash-card analytics-card">
		<div class="card-header">
			<div>
				<h2>Analytics 14 Hari Terakhir</h2>
				<p class="card-subtitle">Performa kunjungan dan respon tamu</p>
			</div>
		</div>

		<div class="analytics-grid">
			<div class="analytics-item">
				<span class="analytics-icon">👁️</span>
				<div>
					<div class="analytics-value">{formatNumber(data.userStats?.totalViews ?? 0)}</div>
					<div class="analytics-label">Total Views</div>
				</div>
			</div>
			<div class="analytics-item">
				<span class="analytics-icon">👤</span>
				<div>
					<div class="analytics-value">{formatNumber(data.userStats?.totalUniqueVisitors ?? 0)}</div>
					<div class="analytics-label">Unique Visitors</div>
				</div>
			</div>
			<div class="analytics-item">
				<span class="analytics-icon">💌</span>
				<div>
					<div class="analytics-value">{formatNumber(data.userStats?.totalRsvp ?? 0)}</div>
					<div class="analytics-label">RSVP Masuk</div>
				</div>
			</div>
		</div>

		<div class="sparkline-wrap">
			<div class="sparkline-header">
				<span>Tren Kunjungan Harian</span>
				<span class="sparkline-max">Puncak: {formatNumber(sparkMax)}</span>
			</div>
			<svg class="sparkline" viewBox="0 0 100 32" preserveAspectRatio="none">
				<defs>
					<linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stop-color="#6c63ff" stop-opacity="0.4" />
						<stop offset="100%" stop-color="#6c63ff" stop-opacity="0" />
					</linearGradient>
				</defs>
				<path d={sparkArea(sparkData)} fill="url(#sparkGrad)" />
				<path
					d={sparkPath(sparkData)}
					fill="none"
					stroke="#6c63ff"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					vector-effect="non-scaling-stroke"
				/>
			</svg>
			<div class="sparkline-axis">
				<span>{formatDate(sparkData[0]?.date)}</span>
				<span>{formatDate(sparkData[sparkData.length - 1]?.date)}</span>
			</div>
		</div>
	</div>

	<!-- Account / Quota card -->
	<div class="dash-card account-card">
		<div class="card-header">
			<div>
				<h2>Status Akun</h2>
				<p class="card-subtitle">Ringkasan langganan & kuota</p>
			</div>
			<span class="status-pill status-pill--{accountStatus.tone}">
				<span class="status-pill-dot"></span>
				{accountStatus.label}
			</span>
		</div>

		<div class="account-info">
			<div class="info-row">
				<span class="info-row__label">Email</span>
				<span class="info-row__value" title={data.user.email}>{data.user.email}</span>
			</div>
			{#if data.user.payment_status === 'paid' && data.user.subscription_ends_at}
				<div class="info-row">
					<span class="info-row__label">Berakhir</span>
					<span class="info-row__value">
						{formatDate(data.user.subscription_ends_at)}
						{#if subscriptionDaysLeft !== null && subscriptionDaysLeft > 0}
							<span class="badge badge-info">{subscriptionDaysLeft} hari</span>
						{/if}
					</span>
				</div>
			{:else if data.trialActive && data.user.trial_ends_at}
				<div class="info-row">
					<span class="info-row__label">Trial sampai</span>
					<span class="info-row__value">
						{formatDate(data.user.trial_ends_at)}
						{#if trialDaysLeft !== null && trialDaysLeft > 0}
							<span class="badge badge-info">{trialDaysLeft} hari</span>
						{/if}
					</span>
				</div>
			{/if}
			<div class="info-row">
				<span class="info-row__label">Bergabung</span>
				<span class="info-row__value">{formatDate(data.user.created_at)}</span>
			</div>
		</div>

		<div class="quota-block">
			<div class="quota-row">
				<div class="quota-head">
					<span class="quota-label">Kuota Undangan</span>
					<span class="quota-num">
						{invitationUsed}<span class="quota-sep">/</span>{invitationLimit}
					</span>
				</div>
				<div class="quota-bar">
					<div
						class="quota-bar__fill"
						style="width: {invitationPct}%; background: var(--dash-gradient-cyan);"
					></div>
				</div>
			</div>

			<div class="quota-row">
				<div class="quota-head">
					<span class="quota-label">Kuota Tamu</span>
					<span class="quota-num">
						{formatNumber(guestUsed)}<span class="quota-sep">/</span>{formatNumber(guestLimit)}
					</span>
				</div>
				<div class="quota-bar">
					<div
						class="quota-bar__fill"
						style="width: {guestPct}%; background: var(--dash-gradient);"
					></div>
				</div>
			</div>
		</div>

		<div class="account-actions">
			<a href="/dashboard/billing" class="btn btn-secondary btn-sm">Kelola Billing</a>
			<a href="/dashboard/profile" class="btn btn-secondary btn-sm">Edit Profil</a>
		</div>
	</div>
</div>

<!-- ─── RSVP BREAKDOWN ───────────────────────────────────────────────── -->
<div class="dash-card">
	<div class="card-header">
		<div>
			<h2>Ringkasan RSVP</h2>
			<p class="card-subtitle">Distribusi respon dari {formatNumber(guestTotal)} tamu</p>
		</div>
	</div>

	{#if guestTotal === 0}
		<div class="empty-mini">
			<span>📭</span>
			<p>Belum ada data tamu. Tambah tamu di halaman undangan untuk melihat ringkasan.</p>
		</div>
	{:else}
		<div class="rsvp-bar">
			<div
				class="rsvp-seg rsvp-seg--attending"
				style="flex: {data.guestStats.attending};"
				title="Hadir: {data.guestStats.attending}"
			></div>
			<div
				class="rsvp-seg rsvp-seg--not"
				style="flex: {data.guestStats.not_attending};"
				title="Tidak hadir: {data.guestStats.not_attending}"
			></div>
			<div
				class="rsvp-seg rsvp-seg--pending"
				style="flex: {data.guestStats.no_response};"
				title="Belum respon: {data.guestStats.no_response}"
			></div>
		</div>
		<div class="rsvp-legend">
			<div class="legend-item">
				<span class="dot dot--attending"></span>
				<span>Hadir</span>
				<strong>{formatNumber(data.guestStats.attending)} ({attendingPct}%)</strong>
			</div>
			<div class="legend-item">
				<span class="dot dot--not"></span>
				<span>Tidak Hadir</span>
				<strong>{formatNumber(data.guestStats.not_attending)} ({notAttendingPct}%)</strong>
			</div>
			<div class="legend-item">
				<span class="dot dot--pending"></span>
				<span>Belum Respon</span>
				<strong>{formatNumber(data.guestStats.no_response)} ({noResponsePct}%)</strong>
			</div>
		</div>
	{/if}
</div>

<!-- ─── INVITATIONS + RECENT WISHES ─────────────────────────────────── -->
<div class="grid-2">
	<!-- Recent Invitations -->
	<div class="dash-card">
		<div class="card-header">
			<div>
				<h2>Undangan Terbaru</h2>
				<p class="card-subtitle">{data.invitations.length} undangan tersimpan</p>
			</div>
			{#if data.invitations.length > 0}
				<a href="/dashboard/invitations" class="btn btn-secondary btn-sm">Lihat Semua</a>
			{/if}
		</div>

		{#if data.invitations.length === 0}
			<div class="empty-state">
				<div class="empty-icon">💍</div>
				<h3>Belum ada undangan</h3>
				<p>Mulai buat undangan pernikahan digitalmu sekarang!</p>
				<a href="/dashboard/create" class="btn btn-primary">Buat Undangan Pertama</a>
			</div>
		{:else}
			<div class="inv-list">
				{#each data.invitations.slice(0, 5) as inv}
					<div class="inv-item">
						<div class="inv-item__main">
							<div class="inv-item__title">
								{inv.bride_name} & {inv.groom_name}
							</div>
							<div class="inv-item__meta">
								<code>/{inv.slug}</code>
								{#if inv.akad_date}
									<span class="meta-sep">•</span>
									<span>📅 {formatDate(inv.akad_date)}</span>
								{/if}
							</div>
						</div>
						<div class="inv-item__actions">
							<span class="badge {inv.is_published ? 'badge-success' : 'badge-warning'}">
								{inv.is_published ? 'Published' : 'Draft'}
							</span>
							<a href="/dashboard/invitations/{inv.id}" class="btn btn-secondary btn-sm">
								Edit
							</a>
							{#if inv.is_published}
								<a href="/invitation/{inv.slug}" target="_blank" class="btn btn-secondary btn-sm">
									Lihat
								</a>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Recent Wishes / RSVP -->
	<div class="dash-card">
		<div class="card-header">
			<div>
				<h2>RSVP Terbaru</h2>
				<p class="card-subtitle">5 ucapan & konfirmasi terakhir</p>
			</div>
		</div>

		{#if !data.recentWishes || data.recentWishes.length === 0}
			<div class="empty-state">
				<div class="empty-icon">💬</div>
				<h3>Belum ada RSVP</h3>
				<p>Bagikan link undanganmu agar tamu bisa memberi ucapan & konfirmasi kehadiran.</p>
			</div>
		{:else}
			<div class="wish-list">
				{#each data.recentWishes as w}
					<div class="wish-item">
						<div class="wish-avatar">
							{w.guest_name.charAt(0).toUpperCase()}
						</div>
						<div class="wish-body">
							<div class="wish-head">
								<strong class="wish-name">{w.guest_name}</strong>
								<span
									class="badge {w.is_attending === 'hadir'
										? 'badge-success'
										: w.is_attending === 'tidak_hadir' || w.is_attending === 'tidak hadir'
											? 'badge-danger'
											: 'badge-info'}"
								>
									{w.is_attending === 'hadir'
										? '✅ Hadir'
										: w.is_attending === 'tidak_hadir' || w.is_attending === 'tidak hadir'
											? '❌ Tidak'
											: '🤔 Ragu'}
								</span>
							</div>
							<p class="wish-msg">{w.message}</p>
							<div class="wish-foot">
								<a class="wish-target" href="/invitation/{w.slug}" target="_blank">
									{w.bride_name} &amp; {w.groom_name}
								</a>
								<span class="wish-time">{formatRelative(w.created_at)}</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- ─── QUICK ACTIONS ───────────────────────────────────────────────── -->
<div class="dash-card quick-card">
	<div class="card-header">
		<div>
			<h2>Aksi Cepat</h2>
			<p class="card-subtitle">Kelola undangan dengan satu klik</p>
		</div>
	</div>
	<div class="quick-grid">
		<a href="/dashboard/create" class="quick-link quick-link--accent">
			<span class="quick-icon">➕</span>
			<span class="quick-text">
				<strong>Buat Undangan</strong>
				<small>Pilih template & isi data</small>
			</span>
		</a>
		<a href="/dashboard/invitations" class="quick-link">
			<span class="quick-icon">📋</span>
			<span class="quick-text">
				<strong>Undangan Saya</strong>
				<small>Edit & kelola data</small>
			</span>
		</a>
		<a href="/dashboard/import-guests" class="quick-link">
			<span class="quick-icon">👥</span>
			<span class="quick-text">
				<strong>Import Tamu</strong>
				<small>Upload daftar dari Excel</small>
			</span>
		</a>
		<a href="/dashboard/media" class="quick-link">
			<span class="quick-icon">🖼️</span>
			<span class="quick-text">
				<strong>Media & Foto</strong>
				<small>Kelola galeri foto</small>
			</span>
		</a>
	</div>
</div>

<style>
	.dash-header-sub {
		color: var(--dash-text-muted);
		font-size: 0.95rem;
		margin-top: 0.25rem;
	}
	.header-actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	/* ─── Status banner ──────────────────────────────────────────────── */
	.status-banner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.1rem 1.4rem;
		border-radius: var(--radius-md);
		margin-bottom: var(--space-lg);
		gap: 1rem;
		border: 1px solid transparent;
		animation: fadeInUp 0.4s ease;
	}
	.status-banner--danger {
		background: rgba(231, 76, 60, 0.08);
		border-color: rgba(231, 76, 60, 0.25);
		color: #ffb4ae;
	}
	.status-banner--warning {
		background: rgba(243, 156, 18, 0.08);
		border-color: rgba(243, 156, 18, 0.25);
		color: #ffd591;
	}
	.status-banner--info {
		background: rgba(108, 99, 255, 0.08);
		border-color: rgba(108, 99, 255, 0.3);
		color: #c8c4ff;
	}
	.banner-content {
		display: flex;
		align-items: center;
		gap: 0.85rem;
	}
	.banner-icon {
		font-size: 1.6rem;
		flex-shrink: 0;
	}
	.banner-text strong {
		display: block;
		margin-bottom: 0.15rem;
		color: var(--dash-text);
		font-size: 0.95rem;
	}
	.banner-text p {
		font-size: 0.85rem;
		opacity: 0.9;
		line-height: 1.5;
	}

	/* ─── Stats top section enhancements ─────────────────────────────── */
	.dash-stat {
		padding: 1.1rem 1.2rem;
	}
	.stat-top {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.4rem;
	}
	.stat-top .stat-icon {
		font-size: 1.3rem;
		margin: 0;
	}
	.stat-top h3 {
		margin: 0;
		font-size: 0.72rem;
	}
	.dash-stat .value {
		font-size: 2rem;
	}

	/* ─── Grid layouts ───────────────────────────────────────────────── */
	.grid-2 {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-md);
		margin-bottom: var(--space-md);
	}
	@media (min-width: 960px) {
		.grid-2 {
			grid-template-columns: 1fr 1fr;
		}
	}

	.grid-2-1 {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-md);
		margin-bottom: var(--space-md);
	}
	@media (min-width: 960px) {
		.grid-2-1 {
			grid-template-columns: 1.4fr 1fr;
		}
	}

	/* ─── Card header (shared) ───────────────────────────────────────── */
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.25rem;
		gap: 0.75rem;
	}
	.card-header h2 {
		font-family: var(--font-serif);
		font-size: 1.15rem;
		margin: 0;
	}
	.card-subtitle {
		color: var(--dash-text-muted);
		font-size: 0.8rem;
		margin-top: 0.2rem;
	}

	/* ─── Analytics card ─────────────────────────────────────────────── */
	.analytics-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}
	.analytics-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.85rem;
		background: rgba(255, 255, 255, 0.025);
		border: 1px solid var(--dash-border);
		border-radius: var(--radius-sm);
	}
	.analytics-icon {
		font-size: 1.5rem;
	}
	.analytics-value {
		font-family: var(--font-serif);
		font-size: 1.35rem;
		font-weight: 700;
		line-height: 1.1;
		color: var(--dash-text);
	}
	.analytics-label {
		font-size: 0.72rem;
		color: var(--dash-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		margin-top: 0.15rem;
	}
	@media (max-width: 600px) {
		.analytics-grid {
			grid-template-columns: 1fr;
		}
	}

	.sparkline-wrap {
		padding: 0.85rem;
		background: rgba(255, 255, 255, 0.02);
		border-radius: var(--radius-sm);
		border: 1px solid var(--dash-border);
	}
	.sparkline-header {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: var(--dash-text-muted);
		margin-bottom: 0.4rem;
	}
	.sparkline-max {
		color: var(--dash-accent);
		font-weight: 600;
	}
	.sparkline {
		width: 100%;
		height: 60px;
		display: block;
	}
	.sparkline-axis {
		display: flex;
		justify-content: space-between;
		font-size: 0.7rem;
		color: var(--dash-text-muted);
		margin-top: 0.2rem;
	}

	/* ─── Account card ───────────────────────────────────────────────── */
	.status-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.3rem 0.75rem;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 700;
		flex-shrink: 0;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.status-pill-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: currentColor;
		box-shadow: 0 0 8px currentColor;
	}
	.status-pill--success {
		background: rgba(39, 174, 96, 0.15);
		color: #4ade80;
	}
	.status-pill--info {
		background: rgba(108, 99, 255, 0.15);
		color: #a78bfa;
	}
	.status-pill--warning {
		background: rgba(243, 156, 18, 0.15);
		color: #fbbf24;
	}
	.status-pill--danger {
		background: rgba(231, 76, 60, 0.15);
		color: #f87171;
	}
	.status-pill--neutral {
		background: rgba(136, 136, 170, 0.15);
		color: var(--dash-text-muted);
	}

	.account-info {
		border-top: 1px solid var(--dash-border);
		border-bottom: 1px solid var(--dash-border);
		padding: 0.5rem 0;
		margin-bottom: 1rem;
	}
	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0;
		font-size: 0.85rem;
		gap: 0.5rem;
	}
	.info-row + .info-row {
		border-top: 1px dashed var(--dash-border);
	}
	.info-row__label {
		color: var(--dash-text-muted);
		flex-shrink: 0;
	}
	.info-row__value {
		color: var(--dash-text);
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		text-align: right;
		max-width: 60%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.quota-block {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		margin-bottom: 1rem;
	}
	.quota-row {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.quota-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.quota-label {
		font-size: 0.78rem;
		color: var(--dash-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		font-weight: 600;
	}
	.quota-num {
		font-family: var(--font-serif);
		font-size: 1rem;
		font-weight: 700;
		color: var(--dash-text);
	}
	.quota-sep {
		color: var(--dash-text-muted);
		margin: 0 0.15rem;
		font-weight: 400;
	}
	.quota-bar {
		height: 6px;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 999px;
		overflow: hidden;
	}
	.quota-bar__fill {
		height: 100%;
		border-radius: 999px;
		transition: width 0.5s ease;
	}

	.account-actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	/* ─── RSVP breakdown ─────────────────────────────────────────────── */
	.rsvp-bar {
		display: flex;
		height: 14px;
		border-radius: 999px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.05);
		margin-bottom: 0.85rem;
	}
	.rsvp-seg {
		min-width: 0;
		transition: flex-grow 0.4s ease;
	}
	.rsvp-seg--attending {
		background: var(--dash-gradient-green);
	}
	.rsvp-seg--not {
		background: var(--dash-gradient-warm);
	}
	.rsvp-seg--pending {
		background: var(--dash-gradient-pink);
	}
	.rsvp-legend {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 0.5rem;
	}
	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: rgba(255, 255, 255, 0.025);
		border-radius: var(--radius-sm);
		font-size: 0.85rem;
	}
	.legend-item strong {
		margin-left: auto;
		font-family: var(--font-serif);
		color: var(--dash-text);
	}
	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		flex-shrink: 0;
	}
	.dot--attending { background: #22c55e; }
	.dot--not { background: #f59e0b; }
	.dot--pending { background: #ec4899; }

	.empty-mini {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.02);
		border: 1px dashed var(--dash-border);
		border-radius: var(--radius-sm);
		color: var(--dash-text-muted);
		font-size: 0.85rem;
	}
	.empty-mini span {
		font-size: 1.5rem;
	}

	/* ─── Invitations list ───────────────────────────────────────────── */
	.empty-state {
		text-align: center;
		padding: 2rem 1rem;
	}
	.empty-icon {
		font-size: 2.5rem;
		margin-bottom: 0.75rem;
	}
	.empty-state h3 {
		font-family: var(--font-serif);
		font-size: 1.15rem;
		margin-bottom: 0.4rem;
	}
	.empty-state p {
		color: var(--dash-text-muted);
		font-size: 0.85rem;
		margin-bottom: 1.25rem;
	}

	.inv-list {
		display: flex;
		flex-direction: column;
	}
	.inv-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.85rem 0;
		border-bottom: 1px solid var(--dash-border);
		gap: 0.75rem;
	}
	.inv-item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}
	.inv-item:first-child {
		padding-top: 0;
	}
	.inv-item__main {
		min-width: 0;
		flex: 1;
	}
	.inv-item__title {
		font-family: var(--font-serif);
		font-size: 1rem;
		color: var(--dash-text);
		margin-bottom: 0.2rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.inv-item__meta {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		flex-wrap: wrap;
		font-size: 0.78rem;
		color: var(--dash-text-muted);
	}
	.inv-item__meta code {
		background: rgba(108, 99, 255, 0.1);
		color: #a78bfa;
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
		font-size: 0.72rem;
	}
	.meta-sep {
		opacity: 0.5;
	}
	.inv-item__actions {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		flex-shrink: 0;
		flex-wrap: wrap;
		justify-content: flex-end;
	}
	@media (max-width: 600px) {
		.inv-item {
			flex-direction: column;
			align-items: flex-start;
		}
		.inv-item__actions {
			width: 100%;
			justify-content: flex-start;
		}
	}

	/* ─── Wishes list ────────────────────────────────────────────────── */
	.wish-list {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}
	.wish-item {
		display: flex;
		gap: 0.75rem;
		padding: 0.85rem;
		background: rgba(255, 255, 255, 0.025);
		border: 1px solid var(--dash-border);
		border-radius: var(--radius-sm);
		transition: all var(--transition-base);
	}
	.wish-item:hover {
		border-color: rgba(108, 99, 255, 0.3);
		background: rgba(255, 255, 255, 0.04);
	}
	.wish-avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--dash-gradient);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 0.9rem;
		flex-shrink: 0;
	}
	.wish-body {
		flex: 1;
		min-width: 0;
	}
	.wish-head {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
		flex-wrap: wrap;
	}
	.wish-name {
		font-size: 0.9rem;
		color: var(--dash-text);
	}
	.wish-msg {
		font-size: 0.85rem;
		color: var(--dash-text);
		opacity: 0.9;
		line-height: 1.45;
		margin-bottom: 0.4rem;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.wish-foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.72rem;
		gap: 0.5rem;
	}
	.wish-target {
		color: var(--dash-accent);
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.wish-target:hover {
		text-decoration: underline;
	}
	.wish-time {
		color: var(--dash-text-muted);
		flex-shrink: 0;
	}

	/* ─── Quick actions ──────────────────────────────────────────────── */
	.quick-card {
		margin-bottom: 0;
	}
	.quick-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 0.75rem;
	}
	.quick-link {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.025);
		border: 1px solid var(--dash-border);
		border-radius: var(--radius-sm);
		transition: all var(--transition-base);
		color: var(--dash-text);
	}
	.quick-link:hover {
		border-color: var(--dash-accent);
		background: rgba(108, 99, 255, 0.08);
		transform: translateY(-2px);
	}
	.quick-link--accent {
		background: linear-gradient(135deg, rgba(108, 99, 255, 0.15), rgba(167, 139, 250, 0.05));
		border-color: rgba(108, 99, 255, 0.35);
	}
	.quick-icon {
		font-size: 1.6rem;
		flex-shrink: 0;
	}
	.quick-text {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.quick-text strong {
		font-size: 0.9rem;
		color: var(--dash-text);
	}
	.quick-text small {
		font-size: 0.72rem;
		color: var(--dash-text-muted);
		margin-top: 0.15rem;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(15px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
