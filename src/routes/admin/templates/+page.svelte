<script lang="ts">
	import type { PageData } from './$types';
	import { getTemplateCategoryLabel } from '$lib/template-categories';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Template - Admin {data.appName}</title></svelte:head>

<div class="dash-header">
	<h1>🎨 Template</h1>
</div>

<div class="template-grid">
	{#each data.templates as template}
		<div class="dash-card template-card">
			<div class="template-preview" style="background: linear-gradient(135deg, {template.primary_color}, {template.secondary_color})">
				<span style="color: {template.accent_color}; font-family: {template.font_family}, serif; font-size: 1.4rem">{template.name}</span>
			</div>
			<div class="template-details">
				<span class="template-cat">{getTemplateCategoryLabel(template.category)}</span>
				<h3>{template.name}</h3>
				<p>{template.description}</p>
				<div class="template-meta">
					<span>Layout: {template.layout_style}</span>
					<span>Font: {template.font_family}</span>
				</div>
				<div class="color-swatches">
					<span class="swatch" style="background: {template.primary_color}" title="Primary"></span>
					<span class="swatch" style="background: {template.secondary_color}" title="Secondary"></span>
					<span class="swatch" style="background: {template.accent_color}; border: 1px solid #555" title="Accent"></span>
				</div>
				<div class="template-actions" style="margin-top: 1.5rem;">
					<a href="/admin/templates/preview/{template.id}" class="btn btn-secondary btn-sm w-full" style="text-align: center; display: block;">
						👁️ Preview Halaman Tamu
					</a>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.template-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
	}
	.template-card {
		padding: 0 !important;
		overflow: hidden;
	}
	.template-preview {
		height: 180px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.template-details {
		padding: 1.5rem;
	}
	.template-cat {
		display: inline-block;
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--dash-accent);
		margin-bottom: 0.35rem;
	}
	.template-details h3 {
		font-family: var(--font-serif);
		margin-bottom: 0.5rem;
	}
	.template-details p {
		color: var(--dash-text-muted);
		font-size: 0.85rem;
		line-height: 1.5;
		margin-bottom: 0.75rem;
	}
	.template-meta {
		display: flex;
		gap: 1rem;
		font-size: 0.8rem;
		color: var(--dash-text-muted);
		margin-bottom: 0.75rem;
	}
	.color-swatches {
		display: flex;
		gap: 0.4rem;
	}
	.swatch {
		width: 24px;
		height: 24px;
		border-radius: 6px;
	}
</style>
