<script lang="ts">
	import type { LayoutData } from './$types';
	let { data, children }: { data: LayoutData; children: any } = $props();

	let sidebarOpen = $state(false);
</script>

<div class="dash-layout">
	<button class="mobile-toggle" onclick={() => sidebarOpen = !sidebarOpen}>
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M3 12h18M3 6h18M3 18h18"/>
		</svg>
	</button>

	<aside class="dash-sidebar" class:open={sidebarOpen}>
		<div class="dash-sidebar-logo">
			<span class="admin-badge">ADMIN</span>
			{data.appName}
		</div>
		<nav class="dash-nav">
			<a href="/admin">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
				Overview
			</a>
			<a href="/admin/users">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
				Users
			</a>
			<a href="/admin/invitations">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
				Undangan
			</a>
			<a href="/admin/templates">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
				Template
			</a>
			<a href="/admin/settings">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
							App Settings
						</a>
						<a href="/admin/promo">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
							Promo Codes
						</a>
						<a href="/admin/audit">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
							Audit Logs
						</a>
						<a href="/admin/profile"> <!-- <--- Perubahan di sini -->
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
				My Profile
			</a>
		</nav>
		<div class="dash-user-info">
			<div class="user-avatar admin-avatar">A</div>
			<div class="user-details">
				<span class="user-name">{data.user?.username}</span>
				<span class="user-role">Administrator</span>
			</div>
		</div>
		<form method="POST" action="/logout">
			<button type="submit" class="logout-btn">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
				Keluar
			</button>
		</form>
	</aside>

	<main class="dash-main">
		{@render children()}
	</main>
</div>

{#if sidebarOpen}
	<button class="sidebar-overlay" onclick={() => sidebarOpen = false}></button>
{/if}

<style>
	.admin-badge {
		display: inline-block;
		background: linear-gradient(135deg, #e74c3c, #c0392b);
		color: white;
		font-size: 0.55rem;
		padding: 0.15rem 0.4rem;
		border-radius: 4px;
		font-family: var(--font-sans);
		letter-spacing: 1px;
		vertical-align: middle;
		margin-right: 0.3rem;
	}
	.admin-avatar {
		background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
	}
	.dash-nav a {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.6rem 1rem;
		color: var(--dash-text-muted);
		font-size: 0.9rem;
		border-radius: 8px;
		transition: all 0.2s;
	}
	.dash-nav a:hover {
		background: rgba(108, 99, 255, 0.1);
		color: var(--dash-text);
	}
	.dash-nav a.active {
		background: var(--dash-accent-light);
		color: var(--dash-accent);
		font-weight: 600;
	}
	.dash-nav a svg {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
		opacity: 0.8;
	}
	.dash-nav a.active svg {
		opacity: 1;
	}
	.mobile-toggle {
		display: none;
		position: fixed;
		top: 1rem;
		left: 1rem;
		z-index: 200;
		background: var(--dash-surface);
		border: 1px solid var(--dash-border);
		border-radius: 8px;
		padding: 0.5rem;
		color: var(--dash-text);
	}
	.dash-user-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 0;
		border-top: 1px solid var(--dash-border);
		margin-top: auto;
	}
	.user-avatar {
		width: 36px;
		height: 36px;
		background: linear-gradient(135deg, #6c63ff, #a78bfa);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: 700;
		font-size: 0.9rem;
	}
	.user-details {
		display: flex;
		flex-direction: column;
	}
	.user-name {
		font-weight: 600;
		font-size: 0.9rem;
	}
	.user-role {
		font-size: 0.75rem;
		color: var(--dash-text-muted);
	}
	.logout-btn {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.6rem 1rem;
		color: var(--dash-text-muted);
		font-size: 0.9rem;
		border-radius: 8px;
		transition: all 0.2s;
		margin-top: 0.5rem;
	}
	.logout-btn:hover {
		background: rgba(231, 76, 60, 0.15);
		color: var(--color-danger);
	}
	.sidebar-overlay {
		display: none;
		position: fixed;
		inset: 0;
		background: rgba(0,0,0,0.5);
		z-index: 99;
		border: none;
	}
	@media (max-width: 768px) {
		.mobile-toggle { display: block; }
		.sidebar-overlay { display: block; }
	}
</style>
