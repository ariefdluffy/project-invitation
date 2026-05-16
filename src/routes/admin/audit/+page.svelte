<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state(data.search);
	let actionFilter = $state(data.actionFilter);

	function formatDate(dateStr: string): string {
		const d = new Date(dateStr);
		return d.toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatTime(dateStr: string): string {
		const d = new Date(dateStr);
		return d.toLocaleTimeString('id-ID', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	}

	function getRelativeTime(dateStr: string): string {
		const now = new Date();
		const date = new Date(dateStr);
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Baru saja';
		if (diffMins < 60) return `${diffMins} menit lalu`;
		if (diffHours < 24) return `${diffHours} jam lalu`;
		if (diffDays < 7) return `${diffDays} hari lalu`;
		return formatDate(dateStr);
	}

	function actionLabel(action: string): string {
		const labels: Record<string, string> = {
			'user.login': 'Login',
			'user.register': 'Registrasi',
			'user.logout': 'Logout',
			'user.password_reset': 'Reset Password',
			'user.password_change': 'Ganti Password',
			'invitation.create': 'Buat Undangan',
			'invitation.update': 'Update Undangan',
			'invitation.delete': 'Hapus Undangan',
			'invitation.publish': 'Publikasi Undangan',
			'invitation.unpublish': 'Unpublish Undangan',
			'invitation.duplicate': 'Duplikasi Undangan',
			'payment.create': 'Buat Pembayaran',
			'payment.success': 'Pembayaran Sukses',
			'payment.failed': 'Pembayaran Gagal',
			'admin.user_create': 'Admin Buat User',
			'admin.user_update': 'Admin Update User',
			'admin.user_delete': 'Admin Hapus User',
			'admin.password_reset': 'Admin Reset Password',
			'admin.settings_update': 'Update Settings',
			'trial.started': 'Trial Dimulai',
			'trial.expired': 'Trial Berakhir',
			'promo.used': 'Promo Digunakan',
			'promo_code.used': 'Kode Promo Digunakan',
			'package.activate': 'Aktivasi Paket'
		};
		return labels[action] || action;
	}

	function getActionIcon(action: string): string {
		if (action.startsWith('user.login')) return '🔐';
		if (action.startsWith('user.register')) return '👤';
		if (action.startsWith('user.logout')) return '🚪';
		if (action.startsWith('user.password')) return '🔑';
		if (action.startsWith('invitation.create')) return '✨';
		if (action.startsWith('invitation.update')) return '✏️';
		if (action.startsWith('invitation.delete')) return '🗑️';
		if (action.startsWith('invitation.publish')) return '🚀';
		if (action.startsWith('invitation.duplicate')) return '📋';
		if (action.startsWith('payment.success')) return '💰';
		if (action.startsWith('payment.failed')) return '❌';
		if (action.startsWith('payment.create')) return '💳';
		if (action.startsWith('admin.')) return '⚙️';
		if (action.startsWith('trial.')) return '⏳';
		if (action.startsWith('promo')) return '🎁';
		if (action.startsWith('package.')) return '📦';
		return '📝';
	}

	function getActionCategory(action: string): string {
		if (action.startsWith('user.')) return 'user';
		if (action.startsWith('invitation.')) return 'invitation';
		if (action.startsWith('payment.')) return 'payment';
		if (action.startsWith('admin.')) return 'admin';
		if (action.startsWith('trial.')) return 'trial';
		if (action.startsWith('promo')) return 'promo';
		if (action.startsWith('package.')) return 'package';
		return 'other';
	}

	const actionCategories = [
		{ value: '', label: 'Semua Aktivitas' },
		{ value: 'user', label: '👤 User' },
		{ value: 'invitation', label: '✨ Undangan' },
		{ value: 'payment', label: '💰 Pembayaran' },
		{ value: 'admin', label: '⚙️ Admin' },
		{ value: 'trial', label: '⏳ Trial' },
		{ value: 'promo', label: '🎁 Promo' }
	];

	function handleFilter() {
		const params = new URLSearchParams();
		if (searchQuery) params.set('search', searchQuery);
		if (actionFilter) params.set('action', actionFilter);
		params.set('page', '1');
		goto(`/admin/audit?${params.toString()}`);
	}

	function clearFilters() {
		searchQuery = '';
		actionFilter = '';
		goto('/admin/audit');
	}

	// Filter logs based on search and action
	const filteredLogs = $derived(
		data.logs.filter(log => {
			const matchSearch = !searchQuery ||
				log.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				log.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				log.user_id?.toLowerCase().includes(searchQuery.toLowerCase());

			const matchAction = !actionFilter || getActionCategory(log.action) === actionFilter;

			return matchSearch && matchAction;
		})
	);
</script>

<svelte:head><title>Audit Logs - Admin</title></svelte:head>

<div class="dash-header">
	<div>
		<h1>📋 Audit Logs</h1>
		<p class="dash-header-sub">
			Catatan lengkap aktivitas pengguna dan admin. Total {data.totalLogs.toLocaleString('id-ID')} log tercatat.
		</p>
	</div>
</div>

<!-- Filter & Search Bar -->
<div class="filter-bar">
	<div class="filter-group">
		<div class="search-box">
			<svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="11" cy="11" r="8"/>
				<path d="m21 21-4.35-4.35"/>
			</svg>
			<input
				type="text"
				class="search-input"
				placeholder="Cari email, user ID, atau detail..."
				bind:value={searchQuery}
				onkeydown={(e) => e.key === 'Enter' && handleFilter()}
			/>
		</div>

		<select class="filter-select" bind:value={actionFilter} onchange={handleFilter}>
			{#each actionCategories as category}
				<option value={category.value}>{category.label}</option>
			{/each}
		</select>

		<button class="btn btn-secondary" onclick={handleFilter}>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
			</svg>
			Filter
		</button>

		{#if searchQuery || actionFilter}
			<button class="btn btn-ghost" onclick={clearFilters}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="18" y1="6" x2="6" y2="18"/>
					<line x1="6" y1="6" x2="18" y2="18"/>
				</svg>
				Reset
			</button>
		{/if}
	</div>

	<div class="filter-info">
		<span class="result-count">{filteredLogs.length} hasil</span>
	</div>
</div>

<!-- Audit Logs Timeline -->
<div class="audit-timeline">
	{#each filteredLogs as log, index}
		<div class="audit-item category-{getActionCategory(log.action)}">
			<div class="audit-icon">
				<span class="icon-emoji">{getActionIcon(log.action)}</span>
			</div>

			<div class="audit-content">
				<div class="audit-header">
					<div class="audit-title">
						<span class="action-badge category-{getActionCategory(log.action)}">
							{actionLabel(log.action)}
						</span>
						{#if log.email}
							<span class="user-email">{log.email}</span>
						{/if}
					</div>
					<div class="audit-time">
						<span class="time-relative" title={formatDate(log.created_at)}>
							{getRelativeTime(log.created_at)}
						</span>
					</div>
				</div>

				{#if log.details}
					<div class="audit-details">
						{log.details}
					</div>
				{/if}

				<div class="audit-meta">
					{#if log.user_id}
						<span class="meta-item">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
								<circle cx="12" cy="7" r="4"/>
							</svg>
							ID: {log.user_id.slice(0, 8)}...
						</span>
					{/if}
					{#if log.ip}
						<span class="meta-item">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<circle cx="12" cy="12" r="10"/>
								<line x1="2" y1="12" x2="22" y2="12"/>
								<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
							</svg>
							{log.ip}
						</span>
					{/if}
					<span class="meta-item">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10"/>
							<polyline points="12 6 12 12 16 14"/>
						</svg>
						{formatTime(log.created_at)}
					</span>
				</div>
			</div>
		</div>
	{/each}

	{#if filteredLogs.length === 0}
		<div class="empty-state">
			<div class="empty-icon">🔍</div>
			<h3>Tidak ada log ditemukan</h3>
			<p>Coba ubah filter atau kata kunci pencarian Anda.</p>
			{#if searchQuery || actionFilter}
				<button class="btn btn-primary" onclick={clearFilters}>Reset Filter</button>
			{/if}
		</div>
	{/if}
</div>

<!-- Pagination -->
{#if filteredLogs.length > 0}
<div class="pagination-bar">
	<div class="pagination-info">
		Halaman {data.page} dari {data.totalPages}
	</div>
	<div class="pagination-buttons">
		<a
			href="/admin/audit?page={data.page - 1}{searchQuery ? `&search=${searchQuery}` : ''}{actionFilter ? `&action=${actionFilter}` : ''}"
			class="btn btn-secondary"
			class:btn-disabled={data.page <= 1}
			aria-disabled={data.page <= 1}
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="15 18 9 12 15 6"/>
			</svg>
			Sebelumnya
		</a>
		<a
			href="/admin/audit?page={data.page + 1}{searchQuery ? `&search=${searchQuery}` : ''}{actionFilter ? `&action=${actionFilter}` : ''}"
			class="btn btn-secondary"
			class:btn-disabled={data.page >= data.totalPages}
			aria-disabled={data.page >= data.totalPages}
		>
			Selanjutnya
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="9 18 15 12 9 6"/>
			</svg>
		</a>
	</div>
</div>
{/if}

<style>
	.dash-header-sub {
		color: var(--dash-text-muted);
		font-size: 0.95rem;
		margin-top: 0.25rem;
		max-width: 48rem;
	}

	/* Filter Bar */
	.filter-bar {
		background: var(--dash-card-bg);
		border: 1px solid var(--dash-border);
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.filter-group {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex: 1;
		flex-wrap: wrap;
	}

	.search-box {
		position: relative;
		flex: 1;
		min-width: 250px;
		max-width: 400px;
	}

	.search-icon {
		position: absolute;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
		width: 18px;
		height: 18px;
		color: var(--dash-text-muted);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem 1rem 0.75rem 2.75rem;
		border: 1px solid var(--dash-border);
		border-radius: 8px;
		background: var(--dash-bg);
		color: var(--dash-text);
		font-size: 0.9rem;
		transition: all 0.2s;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--dash-accent);
		box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
	}

	.filter-select {
		padding: 0.75rem 1rem;
		border: 1px solid var(--dash-border);
		border-radius: 8px;
		background: var(--dash-bg);
		color: var(--dash-text);
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s;
		min-width: 180px;
	}

	.filter-select:focus {
		outline: none;
		border-color: var(--dash-accent);
	}

	.filter-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.result-count {
		font-size: 0.85rem;
		color: var(--dash-text-muted);
		font-weight: 600;
		padding: 0.5rem 1rem;
		background: rgba(108, 99, 255, 0.1);
		border-radius: 20px;
	}

	.btn svg {
		width: 16px;
		height: 16px;
		margin-right: 0.5rem;
	}

	.btn-ghost {
		background: transparent;
		color: var(--dash-text-muted);
		border: 1px solid var(--dash-border);
	}

	.btn-ghost:hover {
		background: var(--dash-bg);
		color: var(--dash-text);
	}

	/* Audit Timeline */
	.audit-timeline {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.audit-item {
		background: var(--dash-card-bg);
		border: 1px solid var(--dash-border);
		border-radius: 12px;
		padding: 1.5rem;
		display: flex;
		gap: 1.25rem;
		transition: all 0.2s;
		position: relative;
		overflow: hidden;
	}

	.audit-item::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		background: var(--category-color);
	}

	.audit-item.category-user {
		--category-color: #3b82f6;
	}

	.audit-item.category-invitation {
		--category-color: #8b5cf6;
	}

	.audit-item.category-payment {
		--category-color: #10b981;
	}

	.audit-item.category-admin {
		--category-color: #f59e0b;
	}

	.audit-item.category-trial {
		--category-color: #06b6d4;
	}

	.audit-item.category-promo {
		--category-color: #ec4899;
	}

	.audit-item.category-package {
		--category-color: #6366f1;
	}

	.audit-item:hover {
		border-color: var(--category-color);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		transform: translateY(-2px);
	}

	.audit-icon {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		background: linear-gradient(135deg, var(--category-color), var(--category-color));
		opacity: 0.15;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		position: relative;
	}

	.icon-emoji {
		font-size: 1.5rem;
		position: relative;
		z-index: 1;
	}

	.audit-content {
		flex: 1;
		min-width: 0;
	}

	.audit-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}

	.audit-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.action-badge {
		padding: 0.35rem 0.85rem;
		border-radius: 6px;
		font-size: 0.8rem;
		font-weight: 600;
		background: var(--category-color);
		color: white;
		white-space: nowrap;
	}

	.user-email {
		color: var(--dash-text);
		font-size: 0.9rem;
		font-weight: 500;
	}

	.audit-time {
		text-align: right;
	}

	.time-relative {
		font-size: 0.8rem;
		color: var(--dash-text-muted);
		white-space: nowrap;
	}

	.audit-details {
		color: var(--dash-text-muted);
		font-size: 0.9rem;
		line-height: 1.6;
		margin-bottom: 0.75rem;
		padding: 0.75rem 1rem;
		background: rgba(108, 99, 255, 0.05);
		border-radius: 8px;
		border-left: 3px solid var(--category-color);
	}

	.audit-meta {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: var(--dash-text-muted);
	}

	.meta-item svg {
		width: 14px;
		height: 14px;
		opacity: 0.6;
	}

	/* Empty State */
	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		background: var(--dash-card-bg);
		border: 1px solid var(--dash-border);
		border-radius: 12px;
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		opacity: 0.5;
	}

	.empty-state h3 {
		color: var(--dash-text);
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
	}

	.empty-state p {
		color: var(--dash-text-muted);
		font-size: 0.95rem;
		margin-bottom: 1.5rem;
	}

	/* Pagination */
	.pagination-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 2rem;
		padding: 1.5rem;
		background: var(--dash-card-bg);
		border: 1px solid var(--dash-border);
		border-radius: 12px;
	}

	.pagination-info {
		font-size: 0.9rem;
		color: var(--dash-text-muted);
		font-weight: 600;
	}

	.pagination-buttons {
		display: flex;
		gap: 1rem;
	}

	.pagination-buttons .btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.pagination-buttons .btn svg {
		width: 16px;
		height: 16px;
		margin: 0;
	}

	.btn-disabled {
		opacity: 0.4;
		pointer-events: none;
		cursor: not-allowed;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.filter-bar {
			flex-direction: column;
			align-items: stretch;
		}

		.filter-group {
			flex-direction: column;
			align-items: stretch;
		}

		.search-box {
			max-width: 100%;
		}

		.filter-select {
			width: 100%;
		}

		.audit-item {
			flex-direction: column;
			gap: 1rem;
		}

		.audit-icon {
			width: 40px;
			height: 40px;
		}

		.audit-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.audit-time {
			text-align: left;
		}

		.audit-meta {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.pagination-bar {
			flex-direction: column;
			gap: 1rem;
		}

		.pagination-buttons {
			width: 100%;
			flex-direction: column;
		}

		.pagination-buttons .btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>
