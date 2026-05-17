<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	let { data, children }: { data: LayoutData; children: any } = $props();

	let sidebarOpen = $state(false);

	function isActive(href: string): boolean {
		const path = $page.url.pathname;
		if (href === '/admin') return path === '/admin';
		return path === href || path.startsWith(href + '/');
	}
</script>

<div class="dash-layout">
	<button class="mobile-toggle" onclick={() => sidebarOpen = !sidebarOpen} aria-label="Toggle menu">
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M3 12h18M3 6h18M3 18h18"/>
		</svg>
	</button>

	<aside class="dash-sidebar" class:open={sidebarOpen}>
		<a href="/admin" class="dash-sidebar-logo" onclick={() => sidebarOpen = false}>
			<span class="logo-icon" aria-hidden="true">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
				</svg>
			</span>
			<span class="logo-text">
				<span class="logo-title">{data.appName}</span>
				<span class="logo-sub">Admin Console</span>
			</span>
		</a>

		<nav class="dash-nav" aria-label="Admin navigation">
			<span class="nav-section-label">Main</span>
			<a href="/admin" class:active={isActive('/admin')} onclick={() => sidebarOpen = false}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
				<span class="nav-label">Overview</span>
			</a>
			<a href="/admin/monitoring" class:active={isActive('/admin/monitoring')} onclick={() => sidebarOpen = false}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
				<span class="nav-label">Monitoring</span>
			</a>

			<span class="nav-section-label">Manajemen</span>
			<a href="/admin/users" class:active={isActive('/admin/users')} onclick={() => sidebarOpen = false}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
				<span class="nav-label">Users</span>
			</a>
			<a href="/admin/invitations" class:active={isActive('/admin/invitations')} onclick={() => sidebarOpen = false}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
				<span class="nav-label">Undangan</span>
			</a>
			<a href="/admin/templates" class:active={isActive('/admin/templates')} onclick={() => sidebarOpen = false}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
				<span class="nav-label">Template</span>
			</a>
			<a href="/admin/promo" class:active={isActive('/admin/promo')} onclick={() => sidebarOpen = false}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
				<span class="nav-label">Promo Codes</span>
			</a>

			<span class="nav-section-label">Sistem</span>
			<a href="/admin/settings" class:active={isActive('/admin/settings')} onclick={() => sidebarOpen = false}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
				<span class="nav-label">App Settings</span>
			</a>
			<a href="/admin/audit" class:active={isActive('/admin/audit')} onclick={() => sidebarOpen = false}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
				<span class="nav-label">Audit Logs</span>
			</a>
			<a href="/admin/profile" class:active={isActive('/admin/profile')} onclick={() => sidebarOpen = false}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
				<span class="nav-label">My Profile</span>
			</a>
		</nav>

		<div class="dash-sidebar-footer">
			<div class="dash-user-card">
				<div class="user-avatar-rounded admin-avatar">
					{(data.user?.username ?? 'A').charAt(0).toUpperCase()}
				</div>
				<div class="user-meta">
					<span class="user-name">{data.user?.username ?? 'Admin'}</span>
					<span class="user-role-label">
						<span class="role-dot"></span>
						Administrator
					</span>
				</div>
			</div>
			<form method="POST" action="/logout">
				<button type="submit" class="dash-logout-btn">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
					Keluar
				</button>
			</form>
		</div>
	</aside>

	<main class="dash-main">
		{@render children()}
	</main>
</div>

{#if sidebarOpen}
	<button class="sidebar-overlay" onclick={() => sidebarOpen = false} aria-label="Close menu"></button>
{/if}

<style>
	.admin-avatar {
		background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
		box-shadow: 0 4px 12px rgba(231, 76, 60, 0.25);
	}

	.dash-sidebar-logo {
		text-decoration: none;
	}

	.logo-text {
		display: flex;
		flex-direction: column;
		line-height: 1.15;
	}

	.logo-title {
		font-family: var(--font-serif);
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--dash-text);
		letter-spacing: 0.01em;
	}

	.logo-sub {
		font-family: var(--font-sans);
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--dash-accent);
		margin-top: 2px;
	}

	.nav-label {
		flex: 1;
	}

	.role-dot {
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #22c55e;
		margin-right: 0.35rem;
		box-shadow: 0 0 6px rgba(34, 197, 94, 0.6);
	}

	.mobile-toggle {
		display: none;
		position: fixed;
		top: 1rem;
		left: 1rem;
		z-index: 200;
		background: var(--dash-surface);
		border: 1px solid var(--dash-border);
		border-radius: 10px;
		padding: 0.55rem;
		color: var(--dash-text);
		box-shadow: 0 4px 12px rgba(0,0,0,0.25);
	}

	.mobile-toggle:hover {
		border-color: var(--dash-accent);
		color: var(--dash-accent);
	}

	.sidebar-overlay {
		display: none;
		position: fixed;
		inset: 0;
		background: rgba(15, 15, 26, 0.7);
		backdrop-filter: blur(2px);
		z-index: 99;
		border: none;
	}

	@media (max-width: 768px) {
		.mobile-toggle { display: block; }
		.sidebar-overlay { display: block; }
	}
</style>
