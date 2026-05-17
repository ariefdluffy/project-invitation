<script lang="ts">
	import type { PageData } from './$types';
	import { getTemplateCategoryLabel } from '$lib/template-categories';

	let { data }: { data: PageData } = $props();

	// Track which iframes have loaded
	let loadedMap = $state<Record<string, boolean>>({});

	function onIframeLoad(id: string) {
		loadedMap = { ...loadedMap, [id]: true };
	}

	const categoryColors: Record<string, string> = {
		pernikahan: '#a78bfa',
		anniversary: '#f472b6',
		aqiqah: '#34d399',
		khitan: '#fbbf24',
		formal: '#60a5fa',
		corporate: '#60a5fa',
		birthday: '#fb923c',
		gathering: '#a3e635'
	};

	function catColor(cat: string) {
		return categoryColors[cat?.toLowerCase()] ?? '#8888aa';
	}
</script>

<svelte:head>
	<title>Template - Admin {data.appName}</title>
</svelte:head>

<div class="dash-header">
	<div>
		<h1>🎨 Template</h1>
		<p class="dash-header-sub">{data.templates.length} template tersedia</p>
	</div>
</div>

<div class="template-grid">
	{#each data.templates as template}
		<div class="template-card dash-card">
			<!-- Live preview thumbnail -->
			<div class="template-preview">
				{#if !loadedMap[template.id]}
					<div class="preview-skeleton">
						<div class="skeleton-shimmer"></div>
						<div class="skeleton-label">Memuat preview…</div>
					</div>
				{/if}
				<iframe
					src="/demo/{template.id}"
					title="Preview {template.name}"
					class="preview-iframe"
					class:loaded={loadedMap[template.id]}
					loading="lazy"
					scrolling="no"
					tabindex="-1"
					aria-hidden="true"
					onload={() => onIframeLoad(template.id)}
				></iframe>
				<!-- Overlay to block iframe interaction -->
				<div class="preview-overlay" aria-hidden="true"></div>
				<!-- Category badge -->
				<span
					class="cat-badge"
					style="background: {catColor(template.category)}22; color: {catColor(template.category)}; border-color: {catColor(template.category)}44;"
				>
					{getTemplateCategoryLabel(template.category)}
				</span>
			</div>

			<!-- Card details -->
			<div class="template-details">
				<h3 class="template-name">{template.name}</h3>
				<p class="template-desc">{template.description}</p>

				<div class="template-meta">
					{#if template.layout_style}
						<span class="meta-chip">
							<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
							{template.layout_style}
						</span>
					{/if}
					{#if template.font_family}
						<span class="meta-chip">
							<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
							{template.font_family}
						</span>
					{/if}
				</div>

				<div class="card-footer">
					<div class="color-swatches">
						{#if template.primary_color}
							<span class="swatch" style="background:{template.primary_color}" title="Primary: {template.primary_color}"></span>
						{/if}
						{#if template.secondary_color}
							<span class="swatch" style="background:{template.secondary_color}" title="Secondary: {template.secondary_color}"></span>
						{/if}
						{#if template.accent_color}
							<span class="swatch" style="background:{template.accent_color}; border:1px solid rgba(255,255,255,0.15)" title="Accent: {template.accent_color}"></span>
						{/if}
					</div>
					<a
						href="/demo/{template.id}"
						class="btn btn-primary btn-sm"
						target="_blank"
						rel="noopener"
					>
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
						Preview
					</a>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.dash-header-sub {
		color: var(--dash-text-muted);
		font-size: 0.9rem;
		margin-top: 0.2rem;
	}

	/* ─── Grid: 4 col desktop, 2 tablet, 1 mobile ─────────────────────── */
	.template-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.25rem;
	}
	@media (max-width: 1280px) {
		.template-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	@media (max-width: 900px) {
		.template-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 560px) {
		.template-grid {
			grid-template-columns: 1fr;
		}
	}

	/* ─── Card ─────────────────────────────────────────────────────────── */
	.template-card {
		padding: 0 !important;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
	}
	.template-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
		border-color: rgba(108, 99, 255, 0.4);
	}

	/* ─── Preview area ─────────────────────────────────────────────────── */
	.template-preview {
		position: relative;
		height: 220px;
		overflow: hidden;
		background: #0d0d1a;
		flex-shrink: 0;
	}

	/* Skeleton loader */
	.preview-skeleton {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		z-index: 2;
		background: #0d0d1a;
	}
	.skeleton-shimmer {
		width: 60%;
		height: 8px;
		border-radius: 999px;
		background: linear-gradient(90deg, #1a1a2e 25%, #2a2a4a 50%, #1a1a2e 75%);
		background-size: 200% 100%;
		animation: shimmer 1.4s infinite;
	}
	.skeleton-label {
		font-size: 0.7rem;
		color: var(--dash-text-muted);
	}
	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}

	/* Iframe scaled to fit the 220px preview box */
	.preview-iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 1280px;   /* full desktop width */
		height: 900px;   /* enough to show above-fold */
		border: none;
		transform-origin: top left;
		transform: scale(calc(100% / 1280));  /* scale down to card width */
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.4s ease;
	}
	/* Use container-query-like trick: scale to card width dynamically */
	.template-preview .preview-iframe {
		/* card is ~25vw on 4-col layout, but we use a fixed approach */
		transform: scale(0.235);
	}
	@media (max-width: 1280px) {
		.template-preview .preview-iframe {
			transform: scale(0.27);
		}
	}
	@media (max-width: 900px) {
		.template-preview .preview-iframe {
			transform: scale(0.38);
		}
	}
	@media (max-width: 560px) {
		.template-preview .preview-iframe {
			transform: scale(0.55);
		}
	}
	.preview-iframe.loaded {
		opacity: 1;
	}

	/* Transparent overlay to block iframe clicks */
	.preview-overlay {
		position: absolute;
		inset: 0;
		z-index: 3;
		cursor: default;
	}

	/* Category badge */
	.cat-badge {
		position: absolute;
		top: 0.6rem;
		left: 0.6rem;
		z-index: 4;
		font-size: 0.62rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		border: 1px solid transparent;
		backdrop-filter: blur(6px);
	}

	/* ─── Details ──────────────────────────────────────────────────────── */
	.template-details {
		padding: 1rem 1.1rem 1.1rem;
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.template-name {
		font-family: var(--font-serif);
		font-size: 1rem;
		color: var(--dash-text);
		margin-bottom: 0.35rem;
		line-height: 1.3;
	}
	.template-desc {
		color: var(--dash-text-muted);
		font-size: 0.78rem;
		line-height: 1.5;
		margin-bottom: 0.65rem;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		flex: 1;
	}

	.template-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-bottom: 0.75rem;
	}
	.meta-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.68rem;
		color: var(--dash-text-muted);
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid var(--dash-border);
		padding: 0.2rem 0.5rem;
		border-radius: 999px;
		text-transform: capitalize;
	}

	/* ─── Footer row ───────────────────────────────────────────────────── */
	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-top: auto;
	}
	.color-swatches {
		display: flex;
		gap: 0.3rem;
	}
	.swatch {
		width: 18px;
		height: 18px;
		border-radius: 5px;
		flex-shrink: 0;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
	}

	.btn-sm svg {
		flex-shrink: 0;
	}
</style>
