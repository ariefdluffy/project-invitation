<script lang="ts">
	import type { PageData } from './$types';
	import { getTemplateCategoryLabel } from '$lib/template-categories';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/toast.svelte';

	let { data }: { data: PageData } = $props();
	let showCreateModal = $state(false);
	let showDeleteConfirm = $state<string | null>(null);

	function handleEnhance(msg: string) {
		return async ({ result, update }: any) => {
			await update();
			if (result.type === 'success') { toast.success(msg); showCreateModal = false; showDeleteConfirm = null; }
			else if (result.type === 'failure') { const d = result.data as any; if (d?.error) toast.error(d.error); }
		};
	}
</script>

<svelte:head><title>Template - Admin {data.appName}</title></svelte:head>

<div class="dash-header">
	<h1>🎨 Template</h1>
	<button class="btn btn-primary" onclick={() => showCreateModal = true}>+ Template Baru</button>
</div>

<!-- Modal Create Template -->
{#if showCreateModal}
	<div class="modal-overlay" role="button" tabindex="0" onclick={(e) => { if (e.target === e.currentTarget) showCreateModal = false; }} onkeydown={(e) => { if (e.key === 'Escape') showCreateModal = false; }}>
		<div class="modal-content" role="dialog" aria-modal="true">
			<div class="modal-header">
				<h2>Buat Template Baru</h2>
				<button class="btn-close" onclick={() => showCreateModal = false}>✕</button>
			</div>
			<form method="POST" action="?/create" use:enhance={handleEnhance('Template berhasil dibuat')}>
				<div class="modal-body">
					<div class="form-row">
						<div class="form-group">
							<label>ID Template (slug, unik)</label>
							<input name="id" class="form-control" required pattern="[a-z0-9-]+" placeholder="rose-gold" />
						</div>
						<div class="form-group">
							<label>Nama Template</label>
							<input name="name" class="form-control" required placeholder="Rose Gold" />
						</div>
					</div>
					<div class="form-row">
						<div class="form-group">
							<label>Kategori</label>
							<select name="category" class="form-control" required>
								<option value="">Pilih kategori</option>
								<option value="rustic">Rustic</option>
								<option value="modern">Modern</option>
								<option value="classic">Classic</option>
								<option value="garden">Garden</option>
								<option value="minimalis">Minimalis</option>
							</select>
						</div>
						<div class="form-group">
							<label>Layout</label>
							<select name="layout_style" class="form-control">
								<option value="classic">Classic</option>
								<option value="modern">Modern</option>
								<option value="elegant">Elegant</option>
							</select>
						</div>
					</div>
					<div class="form-group">
						<label>Deskripsi</label>
						<textarea name="description" class="form-control" rows="2" placeholder="Deskripsi template..."></textarea>
					</div>
					<div class="form-row">
						<div class="form-group">
							<label>Primary Color</label>
							<input name="primary_color" type="color" class="color-input" value="#d4a574" />
						</div>
						<div class="form-group">
							<label>Secondary Color</label>
							<input name="secondary_color" type="color" class="color-input" value="#f5e6d3" />
						</div>
						<div class="form-group">
							<label>Accent Color</label>
							<input name="accent_color" type="color" class="color-input" value="#6c63ff" />
						</div>
					</div>
					<div class="form-group">
						<label>Font Family</label>
						<input name="font_family" class="form-control" list="font-list" value="Playfair Display" placeholder="Playfair Display" />
						<datalist id="font-list">
							<option value="Playfair Display">
							<option value="Great Vibes">
							<option value="Lembar Moment">
							<option value="Montserrat">
							<option value="Cinzel">
							<option value="Lora">
							<option value="Special Elite">
							<option value="Cinzel Decorative">
							<option value="Outfit">
							<option value="Cormorant Garamond">
							<option value="Alex Brush">
							<option value="Space Grotesk">
							<option value="Inter">
							<option value="Parisienne">
							<option value="Tangerine">
							<option value="Dancing Script">
						</datalist>
					</div>
					<div class="form-group">
						<label>Content JSON (opsional)</label>
						<textarea name="content" class="form-control" rows="4" placeholder={'{"sections": []}'}></textarea>
					</div>
				</div>
				<div class="modal-actions">
					<button type="button" class="btn btn-secondary" onclick={() => showCreateModal = false}>Batal</button>
					<button type="submit" class="btn btn-primary">Buat Template</button>
				</div>
			</form>
		</div>
	</div>
{/if}

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
					<a href="/admin/templates/preview/{template.id}" class="btn btn-secondary btn-sm" style="text-align: center; display: block;">
						👁️ Preview
					</a>
					<button type="button" class="btn btn-primary btn-sm" onclick={() => { /* edit not implemented in modal yet, edit via JSON in create modal */ toast.success('Gunakan action edit via API'); }} style="margin-top:0.5rem">
						✏️ Edit
					</button>
					<form method="POST" action="?/delete" use:enhance={handleEnhance('Template berhasil dihapus')} style="margin-top:0.5rem">
						<input type="hidden" name="id" value={template.id} />
						<input type="hidden" name="category" value={template.category} />
						<button type="submit" class="btn btn-danger btn-sm" style="width:100%"
							onclick={(e) => { if (!confirm('Yakin hapus template ' + template.name + '?')) e.preventDefault(); }}>
							🗑️ Hapus
						</button>
					</form>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.template-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.75rem;
	}
	.template-card {
		padding: 0 !important;
		overflow: hidden;
	}
	.template-preview {
		height: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.template-preview span {
		font-size: 1rem !important;
	}
	.template-details {
		padding: 0.6rem;
	}
	.template-cat {
		display: inline-block;
		font-size: 0.6rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--dash-accent);
		margin-bottom: 0.25rem;
	}
	.template-details h3 {
		font-family: var(--font-serif);
		margin-bottom: 0.3rem;
		font-size: 0.82rem;
	}
	.template-details p {
		color: var(--dash-text-muted);
		font-size: 0.7rem;
		line-height: 1.4;
		margin-bottom: 0.4rem;
	}
	.template-meta {
		display: flex;
		gap: 0.5rem;
		font-size: 0.65rem;
		color: var(--dash-text-muted);
		margin-bottom: 0.4rem;
		flex-wrap: wrap;
	}
	.color-swatches {
		display: flex;
		gap: 0.3rem;
	}
	.swatch {
		width: 16px;
		height: 16px;
		border-radius: 4px;
	}
	.template-actions {
		margin-top: 0.5rem !important;
	}
	.template-actions .btn {
		font-size: 0.65rem !important;
		padding: 0.2rem 0.4rem !important;
	}
	@media (max-width: 1200px) {
		.template-grid { grid-template-columns: repeat(3, 1fr); }
	}
	@media (max-width: 900px) {
		.template-grid { grid-template-columns: repeat(2, 1fr); }
	}
	@media (max-width: 600px) {
		.template-grid { grid-template-columns: 1fr; }
	}
</style>
