<script lang="ts">
	import type { LayoutData } from './$types';
	let { data, children }: { data: LayoutData; children: any } = $props();

	let sidebarOpen = $state(false);
	const currentPath = $derived($state.snapshot(data));
</script>

<div class="dash-layout">
	<!-- Mobile Toggle -->
	<button class="mobile-toggle" onclick={() => sidebarOpen = !sidebarOpen}>
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M3 12h18M3 6h18M3 18h18"/>
		</svg>
	</button>

	<!-- Sidebar -->
	<aside class="dash-sidebar" class:open={sidebarOpen}>
		<div class="dash-sidebar-logo">{data.appName}</div>
		<nav class="dash-nav">
			<a href="/dashboard" class="dash-nav-item">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
				Dashboard
			</a>
			<a href="/dashboard/create" class="dash-nav-item">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
				Buat Undangan
			</a>
			<a href="/dashboard/invitations" class="dash-nav-item">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
				Undangan Saya
			</a>
			<a href="/dashboard/media" class="dash-nav-item">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
				Media & Foto
			</a>
			<a href="/dashboard/billing" class="dash-nav-item">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
				Billing & Akses
			</a>
			{#if data.user}
			<a href="/dashboard/profile" class="dash-nav-item">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
				My Profile
			</a>
			{/if}
		</nav>
		<div class="dash-user-info">
			<div class="user-avatar">{data.user.username.charAt(0).toUpperCase()}</div>
			<div class="user-details">
				<span class="user-name">{data.user.username}</span>
				<span class="user-role">{data.user.role}</span>
			</div>
		</div>
		<form method="POST" action="/logout">
			<button type="submit" class="logout-btn">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
				Keluar
			</button>
		</form>
	</aside>

	<!-- Main Content -->
	<main class="dash-main">
		{@render children()}
	</main>
</div>

{#if sidebarOpen}
	<button class="sidebar-overlay" onclick={() => sidebarOpen = false}></button>
{/if}

<style>
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
		text-transform: capitalize;
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
		.mobile-toggle {
			display: block;
		}
		.sidebar-overlay {
			display: block;
		}
	}
</style>
