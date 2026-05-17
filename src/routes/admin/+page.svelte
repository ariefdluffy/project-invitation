<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const stats = $derived([
		{ label: 'Total Users', value: data.users.length, icon: '👥', color: '#6c63ff' },
		{ label: 'Total Undangan', value: data.invitations.length, icon: '💌', color: '#a78bfa' },
		{ label: 'Published', value: data.invitations.filter((i: any) => i.is_published).length, icon: '✅', color: '#27ae60' },
		{ label: 'Template', value: data.templates.length, icon: '🎨', color: '#e67e22' },
	]);

	const paidUsers = $derived(
		data.users.filter((u: { payment_status?: string }) => u.payment_status === 'paid').length
	);
	const pendingUsers = $derived(
		data.users.filter((u: { payment_status?: string }) => u.payment_status === 'pending')
	);
	const pendingPreview = $derived(pendingUsers.slice(0, 6));

	const publishedCount = $derived(data.invitations.filter((i: any) => i.is_published).length);
	const draftCount = $derived(data.invitations.length - publishedCount);
	const publishRate = $derived(
		data.invitations.length > 0 ? Math.round((publishedCount / data.invitations.length) * 100) : 0
	);
	const paidRate = $derived(
		data.users.length > 0 ? Math.round((paidUsers / data.users.length) * 100) : 0
	);

	function timeAgo(dateInput: any): string {
		if (!dateInput) return '-';
		const d = new Date(dateInput);
		if (isNaN(d.getTime())) return '-';
		const diff = Date.now() - d.getTime();
		const minutes = Math.floor(diff / 60000);
		if (minutes < 1) return 'baru saja';
		if (minutes < 60) return `${minutes} menit lalu`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours} jam lalu`;
		const days = Math.floor(hours / 24);
		if (days < 30) return `${days} hari lalu`;
		return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>Admin Dashboard - {data.appName}</title>
</svelte:head>

<!-- Hero header -->
<div class="overview-hero">
	<div class="hero-text">
		<span class="hero-eyebrow">Dashboard Overview</span>
		<h1>Selamat datang kembali 👋</h1>
		<p class="hero-sub">
			Pantau kondisi platform, status pembayaran user, dan aktivitas terbaru dalam satu tampilan.
		</p>
	</div>
	<div class="hero-meta">
		<div class="meta-pill">
			<span class="meta-dot"></span>
			Sistem aktif
		</div>
		<div class="meta-pill meta-pill--muted">
			📡 {data.monitoring?.totalAuditLogs || 0} log entri
		</div>
	</div>
</div>

<!-- Primary stats -->
<div class="dash-stats">
	{#each stats as stat, i}
		<div
			class="dash-stat stat-card-anim"
			class:dash-stat-accent-green={i === 2}
			class:dash-stat-accent-warm={i === 3}
			class:dash-stat-accent-cyan={i === 1}
			style="animation-delay: {i * 0.06}s"
		>
			<div class="stat-card-top">
				<span class="stat-icon-bubble" style="--bubble-color: {stat.color}">
					<span aria-hidden="true">{stat.icon}</span>
				</span>
				<h3>{stat.label}</h3>
			</div>
			<div class="value">{stat.value.toLocaleString('id-ID')}</div>
			<p class="stat-sub">
				{#if i === 0}
					{paidUsers} sudah bayar &middot; {pendingUsers.length} pending
				{:else if i === 1}
					{publishedCount} published &middot; {draftCount} draft
				{:else if i === 2}
					{publishRate}% dari total undangan
				{:else}
					Variasi desain tersedia
				{/if}
			</p>
		</div>
	{/each}
</div>

<!-- Quick links -->
<section class="section-block">
	<div class="section-head">
		<h2>Akses cepat</h2>
		<span class="section-sub">Modul yang sering kamu kelola</span>
	</div>
	<div class="quick-links">
		<a href="/admin/users" class="quick-link-card">
			<div class="ql-icon ql-icon--purple">👥</div>
			<div class="ql-info">
				<h3>Users</h3>
				<p>{data.monitoring?.users?.total || data.users.length} pengguna terdaftar</p>
			</div>
			<span class="ql-arrow" aria-hidden="true">→</span>
		</a>
		<a href="/admin/promo" class="quick-link-card">
			<div class="ql-icon ql-icon--pink">🏷️</div>
			<div class="ql-info">
				<h3>Promo Codes</h3>
				<p>Kelola kode diskon</p>
			</div>
			<span class="ql-arrow" aria-hidden="true">→</span>
		</a>
		<a href="/admin/audit" class="quick-link-card">
			<div class="ql-icon ql-icon--cyan">📋</div>
			<div class="ql-info">
				<h3>Audit Logs</h3>
				<p>{data.monitoring?.totalAuditLogs || 0} entri</p>
			</div>
			<span class="ql-arrow" aria-hidden="true">→</span>
		</a>
		<a href="/admin/monitoring" class="quick-link-card">
			<div class="ql-icon ql-icon--green">📡</div>
			<div class="ql-info">
				<h3>Monitoring</h3>
				<p>Statistik real-time</p>
			</div>
			<span class="ql-arrow" aria-hidden="true">→</span>
		</a>
	</div>
</section>

<!-- Payment overview -->
<section class="section-block">
	<div class="section-head">
		<h2>Status pembayaran</h2>
		<span class="section-sub">Ringkasan aktivasi premium pengguna</span>
	</div>
	<div class="payment-grid">
		<div class="payment-tile payment-tile--paid">
			<div class="payment-tile-head">
				<span class="payment-icon">✅</span>
				<span class="payment-tag">Aktif</span>
			</div>
			<div class="payment-tile-body">
				<span class="payment-label">Sudah bayar</span>
				<span class="payment-value">{paidUsers.toLocaleString('id-ID')}</span>
				<span class="payment-foot">Dari total {data.users.length} user · {paidRate}%</span>
			</div>
			<div class="payment-progress">
				<div class="payment-progress-fill payment-progress-fill--green" style="width: {paidRate}%"></div>
			</div>
		</div>

		<div class="payment-tile payment-tile--pending">
			<div class="payment-tile-head">
				<span class="payment-icon">⏳</span>
				<span class="payment-tag payment-tag--warm">Menunggu</span>
			</div>
			<div class="payment-tile-body">
				<span class="payment-label">Proses pembayaran</span>
				<span class="payment-value">{pendingUsers.length.toLocaleString('id-ID')}</span>
				<span class="payment-foot">Checkout / menunggu konfirmasi Midtrans</span>
			</div>
			<div class="payment-progress">
				<div
					class="payment-progress-fill payment-progress-fill--warm"
					style="width: {data.users.length > 0 ? Math.round((pendingUsers.length / data.users.length) * 100) : 0}%"
				></div>
			</div>
		</div>

		<div class="payment-tile payment-tile--info">
			<div class="payment-tile-head">
				<span class="payment-icon">📨</span>
				<span class="payment-tag payment-tag--info">Konten</span>
			</div>
			<div class="payment-tile-body">
				<span class="payment-label">Engagement undangan</span>
				<span class="payment-value">{publishRate}%</span>
				<span class="payment-foot">{publishedCount} dari {data.invitations.length} undangan published</span>
			</div>
			<div class="payment-progress">
				<div class="payment-progress-fill payment-progress-fill--blue" style="width: {publishRate}%"></div>
			</div>
		</div>
	</div>
</section>

<!-- Pending users action card -->
{#if pendingPreview.length > 0}
	<section class="section-block">
		<div class="dash-card pending-card">
			<div class="card-header">
				<div>
					<h2>⏳ Menunggu pembayaran</h2>
					<p class="card-sub">{pendingUsers.length} user perlu ditindak lanjuti</p>
				</div>
				<a href="/admin/users?filter=pending" class="btn btn-secondary btn-sm">
					Kelola semua →
				</a>
			</div>
			<div class="table-wrap">
				<table class="dash-table">
					<thead>
						<tr>
							<th>User</th>
							<th>Email</th>
							<th class="text-right">Status</th>
						</tr>
					</thead>
					<tbody>
						{#each pendingPreview as u}
							<tr>
								<td>
									<div class="user-cell">
										<span class="cell-avatar">{u.username.charAt(0).toUpperCase()}</span>
										<span>{u.username}</span>
									</div>
								</td>
								<td class="text-muted">{u.email}</td>
								<td class="text-right">
									<span class="badge badge-warning">Menunggu bayar</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</section>
{/if}

<!-- Recent grids -->
<section class="overview-grid">
	<!-- Recent Users -->
	<div class="dash-card">
		<div class="card-header">
			<div>
				<h2>👥 User terbaru</h2>
				<p class="card-sub">5 pendaftaran paling baru</p>
			</div>
			<div class="card-header-actions">
				<a href="/admin/users?filter=payments" class="btn btn-secondary btn-sm">Pembayaran</a>
				<a href="/admin/users" class="btn btn-secondary btn-sm">Semua →</a>
			</div>
		</div>
		<div class="table-wrap">
			<table class="dash-table">
				<thead>
					<tr>
						<th>User</th>
						<th>Email</th>
						<th class="text-right">Role</th>
					</tr>
				</thead>
				<tbody>
					{#each data.users.slice(0, 5) as user}
						<tr>
							<td>
								<div class="user-cell">
									<span class="cell-avatar">{user.username.charAt(0).toUpperCase()}</span>
									<span>{user.username}</span>
								</div>
							</td>
							<td class="text-muted">{user.email}</td>
							<td class="text-right">
								<span class="badge {user.role === 'admin' ? 'badge-info' : 'badge-success'}">
									{user.role}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Recent Invitations -->
	<div class="dash-card">
		<div class="card-header">
			<div>
				<h2>💌 Undangan terbaru</h2>
				<p class="card-sub">Kreasi user yang baru ditambah</p>
			</div>
			<a href="/admin/invitations" class="btn btn-secondary btn-sm">Lihat semua →</a>
		</div>
		<div class="table-wrap">
			<table class="dash-table">
				<thead>
					<tr>
						<th>Mempelai</th>
						<th>Slug</th>
						<th class="text-right">Status</th>
					</tr>
				</thead>
				<tbody>
					{#each data.invitations.slice(0, 5) as inv}
						<tr>
							<td>
								<div class="couple-cell">
									<span class="couple-name">{inv.bride_name} &amp; {inv.groom_name}</span>
									{#if inv.akad_date}
										<span class="couple-date">📅 {timeAgo(inv.akad_date)}</span>
									{/if}
								</div>
							</td>
							<td>
								<code class="slug-pill">/{inv.slug}</code>
							</td>
							<td class="text-right">
								<span class="badge {inv.is_published ? 'badge-success' : 'badge-warning'}">
									{inv.is_published ? 'Published' : 'Draft'}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>

<style>
	/* === Hero === */
	.overview-hero {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1.5rem;
		flex-wrap: wrap;
		padding: 1.75rem 2rem;
		margin-bottom: 1.75rem;
		border-radius: 18px;
		background:
			radial-gradient(circle at 100% 0%, rgba(108, 99, 255, 0.18), transparent 60%),
			radial-gradient(circle at 0% 100%, rgba(167, 139, 250, 0.12), transparent 55%),
			linear-gradient(135deg, var(--dash-surface) 0%, #20203a 100%);
		border: 1px solid var(--dash-border);
		position: relative;
		overflow: hidden;
	}

	.hero-eyebrow {
		display: inline-block;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--dash-accent);
		margin-bottom: 0.5rem;
	}

	.overview-hero h1 {
		font-family: var(--font-serif);
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--dash-text);
		margin-bottom: 0.4rem;
	}

	.hero-sub {
		color: var(--dash-text-muted);
		font-size: 0.9rem;
		max-width: 38rem;
		line-height: 1.55;
	}

	.hero-meta {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.meta-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.8rem;
		border-radius: 999px;
		background: rgba(34, 197, 94, 0.12);
		color: #4ade80;
		font-size: 0.78rem;
		font-weight: 600;
		border: 1px solid rgba(34, 197, 94, 0.25);
	}

	.meta-pill--muted {
		background: rgba(255, 255, 255, 0.05);
		color: var(--dash-text-muted);
		border-color: var(--dash-border);
	}

	.meta-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #22c55e;
		box-shadow: 0 0 8px rgba(34, 197, 94, 0.7);
		animation: pulseDot 1.8s ease-in-out infinite;
	}

	@keyframes pulseDot {
		0%, 100% { opacity: 1; transform: scale(1); }
		50% { opacity: 0.6; transform: scale(0.85); }
	}

	/* === Section heads === */
	.section-block {
		margin-bottom: 1.75rem;
	}

	.section-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.section-head h2 {
		font-family: var(--font-serif);
		font-size: 1.15rem;
		font-weight: 600;
		color: var(--dash-text);
	}

	.section-sub {
		font-size: 0.78rem;
		color: var(--dash-text-muted);
	}

	/* === Stats animation === */
	.stat-card-anim {
		opacity: 0;
		animation: fadeInUp 0.45s ease forwards;
	}

	.stat-card-top {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.85rem;
	}

	.stat-icon-bubble {
		width: 42px;
		height: 42px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		background: color-mix(in srgb, var(--bubble-color, #6c63ff) 18%, transparent);
		border: 1px solid color-mix(in srgb, var(--bubble-color, #6c63ff) 30%, transparent);
		flex-shrink: 0;
	}

	/* === Quick links === */
	.quick-links {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}

	.quick-link-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.1rem 1.25rem;
		background: var(--dash-card-bg);
		border: 1px solid var(--dash-border);
		border-radius: 14px;
		text-decoration: none;
		color: var(--dash-text);
		transition: all 0.2s ease;
		position: relative;
		overflow: hidden;
	}

	.quick-link-card::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(108, 99, 255, 0.06), transparent 60%);
		opacity: 0;
		transition: opacity 0.2s;
	}

	.quick-link-card:hover {
		transform: translateY(-3px);
		border-color: rgba(108, 99, 255, 0.5);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
	}

	.quick-link-card:hover::before {
		opacity: 1;
	}

	.ql-icon {
		width: 46px;
		height: 46px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.4rem;
		flex-shrink: 0;
		position: relative;
		z-index: 1;
	}

	.ql-icon--purple {
		background: linear-gradient(135deg, rgba(108, 99, 255, 0.2), rgba(167, 139, 250, 0.15));
		border: 1px solid rgba(108, 99, 255, 0.35);
	}

	.ql-icon--pink {
		background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(217, 70, 239, 0.15));
		border: 1px solid rgba(236, 72, 153, 0.35);
	}

	.ql-icon--cyan {
		background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(8, 145, 178, 0.15));
		border: 1px solid rgba(6, 182, 212, 0.35);
	}

	.ql-icon--green {
		background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.15));
		border: 1px solid rgba(34, 197, 94, 0.35);
	}

	.ql-info {
		flex: 1;
		min-width: 0;
		position: relative;
		z-index: 1;
	}

	.ql-info h3 {
		font-size: 0.95rem;
		font-weight: 600;
		margin-bottom: 0.15rem;
		color: var(--dash-text);
	}

	.ql-info p {
		font-size: 0.78rem;
		color: var(--dash-text-muted);
	}

	.ql-arrow {
		font-size: 1.2rem;
		color: var(--dash-text-muted);
		transition: transform 0.2s, color 0.2s;
		position: relative;
		z-index: 1;
	}

	.quick-link-card:hover .ql-arrow {
		transform: translateX(4px);
		color: var(--dash-accent);
	}

	/* === Payment tiles === */
	.payment-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1rem;
	}

	.payment-tile {
		padding: 1.25rem 1.4rem;
		border-radius: 14px;
		background: var(--dash-card-bg);
		border: 1px solid var(--dash-border);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		position: relative;
		overflow: hidden;
		transition: all 0.2s ease;
	}

	.payment-tile:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
	}

	.payment-tile--paid {
		border-top: 3px solid #22c55e;
	}

	.payment-tile--pending {
		border-top: 3px solid #f59e0b;
	}

	.payment-tile--info {
		border-top: 3px solid #06b6d4;
	}

	.payment-tile-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.payment-icon {
		font-size: 1.5rem;
	}

	.payment-tag {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 0.25rem 0.6rem;
		border-radius: 999px;
		background: rgba(34, 197, 94, 0.15);
		color: #22c55e;
	}

	.payment-tag--warm {
		background: rgba(245, 158, 11, 0.15);
		color: #f59e0b;
	}

	.payment-tag--info {
		background: rgba(6, 182, 212, 0.15);
		color: #06b6d4;
	}

	.payment-tile-body {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.payment-label {
		font-size: 0.78rem;
		color: var(--dash-text-muted);
		font-weight: 500;
	}

	.payment-value {
		font-size: 2.25rem;
		font-weight: 700;
		font-family: var(--font-serif);
		color: var(--dash-text);
		line-height: 1.05;
	}

	.payment-foot {
		font-size: 0.74rem;
		color: var(--dash-text-muted);
		margin-top: 0.2rem;
	}

	.payment-progress {
		height: 6px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 999px;
		overflow: hidden;
	}

	.payment-progress-fill {
		height: 100%;
		border-radius: 999px;
		transition: width 0.5s ease;
	}

	.payment-progress-fill--green {
		background: linear-gradient(90deg, #22c55e, #16a34a);
	}

	.payment-progress-fill--warm {
		background: linear-gradient(90deg, #f59e0b, #ef4444);
	}

	.payment-progress-fill--blue {
		background: linear-gradient(90deg, #06b6d4, #0891b2);
	}

	/* === Cards & tables === */
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 1.25rem;
		flex-wrap: wrap;
	}

	.card-header h2 {
		font-family: var(--font-serif);
		font-size: 1.1rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.card-sub {
		font-size: 0.78rem;
		color: var(--dash-text-muted);
	}

	.card-header-actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.pending-card {
		border-left: 3px solid #f59e0b;
	}

	.table-wrap {
		overflow-x: auto;
		margin: 0 -0.5rem;
	}

	.table-wrap .dash-table {
		min-width: 100%;
	}

	.text-right {
		text-align: right;
	}

	.text-muted {
		color: var(--dash-text-muted);
	}

	.user-cell {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-weight: 500;
	}

	.cell-avatar {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: var(--dash-gradient);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: 700;
		font-size: 0.72rem;
		flex-shrink: 0;
	}

	.couple-cell {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.couple-name {
		font-weight: 600;
		color: var(--dash-text);
	}

	.couple-date {
		font-size: 0.72rem;
		color: var(--dash-text-muted);
	}

	.slug-pill {
		display: inline-block;
		font-family: 'Courier New', monospace;
		font-size: 0.78rem;
		padding: 0.18rem 0.5rem;
		background: rgba(108, 99, 255, 0.1);
		color: var(--dash-accent);
		border-radius: 6px;
		border: 1px solid rgba(108, 99, 255, 0.2);
	}

	/* === Overview grid === */
	.overview-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
		gap: 1.25rem;
	}

	@media (max-width: 900px) {
		.overview-grid {
			grid-template-columns: 1fr;
		}
		.overview-hero {
			padding: 1.25rem 1.4rem;
		}
		.overview-hero h1 {
			font-size: 1.4rem;
		}
	}

	@media (max-width: 600px) {
		.card-header {
			flex-direction: column;
			align-items: stretch;
		}
		.card-header-actions {
			width: 100%;
		}
		.payment-value {
			font-size: 1.85rem;
		}
	}
</style>
