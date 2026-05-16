<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/toast.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let activeTab = $state('detail');
	let searchQuery = $state('');
	let showToast = $state(false);
	let selectedTemplate = $state(data.invitation.template_id);
    console.log('DEBUG: invitation.template_id=', data.invitation.template_id, 'selectedTemplate=', selectedTemplate);
	let previewingTemplate = $state(null);
	let showDeleteConfirm = $state(false);

	let filteredGuests = $derived(
		data.guests.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	$effect(() => {
		if (form?.redirect) {
			goto(form.redirect);
		}
		if (form?.success || form?.error) {
			showToast = true;
			const timer = setTimeout(() => {
				showToast = false;
			}, 5000);
			return () => clearTimeout(timer);
		}
	});

	let bridePreview = $state<string | null>(null);
	let groomPreview = $state<string | null>(null);
	let bgPreviews = $state<string[]>([]);
	let galleryPreviews = $state<string[]>([]);
	const MAX_FILE_SIZE = 1024 * 1024;
	const MAX_FILE_SIZE_LABEL = '1MB';

    // Fix for Tab Error: Ensure customContent is initialized
    let customContent = $state(
        typeof data.invitation.custom_content === 'string'
            ? JSON.parse(data.invitation.custom_content || '{}')
            : (data.invitation.custom_content || {})
    );

	// Initial previews from data
	$effect(() => {
		if (data.invitation) {
			if (!bgPreviews.length && data.invitation.background_image) {
				bgPreviews = data.invitation.background_image.split('\n').filter(Boolean);
			}
			if (!galleryPreviews.length && data.invitation.gallery_images) {
				galleryPreviews = data.invitation.gallery_images.split('\n').filter(Boolean);
			}
		}
	});

	function handleFileChange(e: Event, type: string) {
		const input = e.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;
		const file = input.files[0];
		if (file.size > MAX_FILE_SIZE) {
			toast.error(`Ukuran file melebihi batas ${MAX_FILE_SIZE_LABEL}.`);
			input.value = '';
			return;
		}

		if (type === 'bride') {
			bridePreview = URL.createObjectURL(file);
		} else if (type === 'groom') {
			groomPreview = URL.createObjectURL(file);
		}
	}

	function handleUrlChange(e: Event, type: string) {
		const textarea = e.target as HTMLTextAreaElement;
		const urls = textarea.value.split('\n').map(u => u.trim()).filter(Boolean);
		if (type === 'bg') bgPreviews = urls;
		if (type === 'gallery') galleryPreviews = urls;
	}

	async function copyGuestLink(guestName: string) {
		const url = `${window.location.origin}/invitation/${data.invitation.slug}?to=${encodeURIComponent(guestName)}`;
		try {
			// Try modern clipboard API first
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(url);
			} else {
				// Fallback for HTTP or older browsers
				const textarea = document.createElement('textarea');
				textarea.value = url;
				textarea.style.position = 'fixed';
				textarea.style.left = '-9999px';
				textarea.style.opacity = '0';
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand('copy');
				document.body.removeChild(textarea);
			}
			toast.success('Link undangan berhasil disalin!');
		} catch (e) {
			console.error('Failed to copy', e);
			// Last resort fallback - select and copy manually
			const textarea = document.createElement('textarea');
			textarea.value = url;
			textarea.style.position = 'fixed';
			textarea.style.left = '-9999px';
			document.body.appendChild(textarea);
			textarea.select();
			try {
				document.execCommand('copy');
				toast.success('Link undangan berhasil disalin!');
			} catch (e2) {
				toast.error('Gagal menyalin link. Salin manual: ' + url);
			}
			document.body.removeChild(textarea);
		}
	}

	function formatForInput(dateStr: any) {
		if (!dateStr || dateStr === '0000-00-00') return '';
		try {
			// Handle YYYY-MM-DD format directly without timezone conversion
			if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
				return dateStr;
			}
			// Fallback for other date formats
			const d = new Date(dateStr);
			if (isNaN(d.getTime())) return '';
			// Use local date components instead of toISOString()
			const year = d.getFullYear();
			const month = String(d.getMonth() + 1).padStart(2, '0');
			const day = String(d.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		} catch (e) {
			return '';
		}
	}
</script>

<!-- Template Preview Modal -->
{#if previewingTemplate}
	<div class="modal-backdrop" onclick={() => previewingTemplate = null}>
		<div class="preview-modal" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h3>Pratinjau: {previewingTemplate.name}</h3>
				<button type="button" class="close-btn" onclick={() => previewingTemplate = null}>✕</button>
			</div>
			<div class="modal-body demo-body">
				<div class="iframe-container">
					<iframe
						title="Template Demo"
						src="/demo/{previewingTemplate.id}"
						frameborder="0"
					></iframe>
				</div>
				<div class="preview-details">
					<p>{previewingTemplate.description}</p>
				</div>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					class="btn btn-primary w-full"
					onclick={() => {
						selectedTemplate = previewingTemplate.id;
						previewingTemplate = null;
					}}
				>
					Gunakan Template Ini
				</button>
			</div>
		</div>
	</div>
{/if}

<svelte:head>
	<title>Edit {data.invitation.bride_name} & {data.invitation.groom_name} - {data.appName}</title>
</svelte:head>

<div class="dash-header">
	<div>
		<h1>✏️ {data.invitation.bride_name} & {data.invitation.groom_name}</h1>
		<p class="sub">/{data.invitation.slug}</p>
	</div>
	<div class="header-actions">
		{#if data.invitation.is_published}
			<a href="/invitation/{data.invitation.slug}" target="_blank" class="btn btn-secondary btn-sm">👁️ Lihat</a>
			<form method="POST" action="?/unpublish" style="display:inline">
				<button type="submit" class="btn btn-secondary btn-sm">Unpublish</button>
			</form>
		{:else}
			<form method="POST" action="?/publish" style="display:inline">
				<button type="submit" class="btn btn-success btn-sm">🚀 Publish</button>
			</form>
		{/if}
	</div>
</div>

{#if showToast}
	{#if form?.success}
		<div class="toast toast-success">{form.message}</div>
	{/if}
	{#if form?.error}
		<div class="error-message">{form.error}</div>
	{/if}
{/if}

<!-- Stats Section -->
{#if data.stats}
	<div class="stats-grid">
		<div class="stat-card">
			<span class="stat-icon">👁</span>
			<span class="stat-value">{data.stats.totalViews}</span>
			<span class="stat-label">Total Views</span>
		</div>
		<div class="stat-card">
			<span class="stat-icon">👤</span>
			<span class="stat-value">{data.stats.uniqueVisitors}</span>
			<span class="stat-label">Unique Visitors</span>
		</div>
		<div class="stat-card">
			<span class="stat-icon">💌</span>
			<span class="stat-value">{data.stats.totalRsvp}</span>
			<span class="stat-label">RSVP received</span>
		</div>
		<div class="stat-card">
			<span class="stat-icon">✅</span>
			<span class="stat-value">{data.stats.attendingCount}</span>
			<span class="stat-label">Hadir</span>
		</div>
		<div class="stat-card">
			<span class="stat-icon">❌</span>
			<span class="stat-value">{data.stats.notAttendingCount}</span>
			<span class="stat-label">Tidak Hadir</span>
		</div>
	</div>
{/if}

<!-- Tabs -->
<div class="tabs">
	<button class="tab" class:active={activeTab === 'detail'} onclick={() => activeTab = 'detail'}>📝 Detail</button>
	<button class="tab" class:active={activeTab === 'text'} onclick={() => activeTab = 'text'}>✍️ Teks</button>
	<button class="tab" class:active={activeTab === 'guests'} onclick={() => activeTab = 'guests'}>👥 Tamu ({data.guests.length})</button>
	<button class="tab" class:active={activeTab === 'wishes'} onclick={() => activeTab = 'wishes'}>💬 Ucapan ({data.wishes.length})</button>
	<button class="tab" class:active={activeTab === 'settings'} onclick={() => activeTab = 'settings'}>⚙️ Pengaturan</button>
</div>

<!-- Detail Tab -->
{#if activeTab === 'detail'}
	<div class="dash-card">
		<form method="POST" action="?/update" enctype="multipart/form-data">
			<h3 class="col-title" style="margin-bottom: 1rem">🎨 Pilih Desain Template</h3>
            <input type="hidden" name="template_id" value={selectedTemplate} />
			<div class="template-grid-edit">
				{#each data.templates as template}
					<label class="template-option {selectedTemplate === template.id ? 'active' : ''}">
						<input
							type="radio"
							name="template_id_radio"
							value={template.id}
							checked={selectedTemplate === template.id}
							onchange={() => (selectedTemplate = template.id)}
							style="display: none;"
						/>
						<div class="template-preview">
							<img src={template.thumbnail} alt={template.name} />
							{#if selectedTemplate === template.id}
								<div class="selected-badge">✓ Terpilih</div>
							{/if}
						</div>
						<div class="template-info">
							<span class="template-name">{template.name}</span>
							<button
								type="button"
								class="btn-preview-small"
								onclick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									previewingTemplate = template;
								}}
							>🔍 Preview</button>
						</div>
					</label>
				{/each}
			</div>

			<hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.05); margin: 2rem 0;" />
			<div class="form-row">
				<div class="form-col">
					<h3 class="col-title">👰 Mempelai Wanita</h3>
					<div class="form-group">
						<label>Nama Panggilan</label>
						<input name="bride_name" class="form-control" value={data.invitation.bride_name} />
					</div>
					<div class="form-group">
						<label>Nama Lengkap</label>
						<input name="bride_full_name" class="form-control" value={data.invitation.bride_full_name} />
					</div>
					<div class="form-group">
						<label>Orang Tua</label>
						<input name="bride_parents" class="form-control" value={data.invitation.bride_parents} />
					</div>
					<div class="form-group">
						<label>Instagram</label>
						<input name="bride_instagram" class="form-control" value={data.invitation.bride_instagram} />
					</div>
					<div class="form-group photo-upload">
						<label>Foto Mempelai Wanita</label>
						<div class="photo-preview">
							<img src={bridePreview || data.invitation.bride_photo || '/placeholder-bride.jpg'} alt="Bride" />
						</div>
						<input type="file" name="bride_photo" accept="image/*" class="form-control" onchange={e => handleFileChange(e, 'bride')} />
					</div>
				</div>
				<div class="form-col">
					<h3 class="col-title">🤵 Mempelai Pria</h3>
					<div class="form-group">
						<label>Nama Panggilan</label>
						<input name="groom_name" class="form-control" value={data.invitation.groom_name} />
					</div>
					<div class="form-group">
						<label>Nama Lengkap</label>
						<input name="groom_full_name" class="form-control" value={data.invitation.groom_full_name} />
					</div>
					<div class="form-group">
						<label>Orang Tua</label>
						<input name="groom_parents" class="form-control" value={data.invitation.groom_parents} />
					</div>
					<div class="form-group">
						<label>Instagram</label>
						<input name="groom_instagram" class="form-control" value={data.invitation.groom_instagram} />
					</div>
					<div class="form-group photo-upload">
						<label>Foto Mempelai Pria</label>
						<div class="photo-preview">
							<img src={groomPreview || data.invitation.groom_photo || '/placeholder-groom.jpg'} alt="Groom" />
						</div>
						<input type="file" name="groom_photo" accept="image/*" class="form-control" onchange={e => handleFileChange(e, 'groom')} />
					</div>
				</div>
			</div>

			<h3 class="col-title" style="margin-top: 1.5rem">📅 Acara</h3>
			<div class="form-row">
				<div class="form-col">
					<div class="form-group">
						<label for="akad_date">Tanggal Akad</label>
						<input id="akad_date" type="date" name="akad_date" class="form-control" value={formatForInput(data.invitation.akad_date)} />
					</div>
					<div class="form-group">
						<label for="akad_time">Waktu Akad</label>
						<input id="akad_time" type="time" name="akad_time" class="form-control" value={data.invitation.akad_time} />
					</div>
				</div>
				<div class="form-col">
					<div class="form-group">
						<label for="resepsi_date">Tanggal Resepsi</label>
						<input id="resepsi_date" type="date" name="resepsi_date" class="form-control" value={formatForInput(data.invitation.resepsi_date)} />
					</div>
					<div class="form-group">
						<label for="resepsi_time">Waktu Resepsi</label>
						<input id="resepsi_time" type="time" name="resepsi_time" class="form-control" value={data.invitation.resepsi_time} />
					</div>
				</div>
			</div>

			<div class="form-group">
				<label for="venue_name">Nama Tempat</label>
				<input id="venue_name" name="venue_name" class="form-control" value={data.invitation.venue_name} />
			</div>
			<div class="form-group">
				<label for="venue_address">Alamat</label>
				<textarea id="venue_address" name="venue_address" class="form-control">{data.invitation.venue_address}</textarea>
			</div>
			<div class="form-group">
				<label for="venue_map_url">Link Google Maps</label>
				<input id="venue_map_url" name="venue_map_url" class="form-control" value={data.invitation.venue_map_url} />
			</div>

			<h3 class="col-title" style="margin-top: 1.5rem">📖 Kutipan & Cerita</h3>
			<div class="form-group">
				<label for="quote">Kutipan</label>
				<textarea id="quote" name="quote" class="form-control">{data.invitation.quote}</textarea>
			</div>
			<div class="form-group">
				<label for="quote_source">Sumber</label>
				<input id="quote_source" name="quote_source" class="form-control" value={data.invitation.quote_source} />
			</div>
			<div class="form-group">
				<label for="love_story">Love Story</label>
				<textarea id="love_story" name="love_story" class="form-control" rows="5">{data.invitation.love_story}</textarea>
			</div>

			<div class="form-group">
				<label for="respect_person">Hormat Kami</label>
				<p class="sub" style="margin-bottom:0.5rem">Opsional. Masukkan nama pengundang (satu per baris). Jika kosong, akan otomatis menampilkan nama orang tua.</p>
				<textarea
					id="respect_person"
					name="respect_person"
					class="form-control"
					rows="3"
					placeholder="Keluarga Besar Bpk. A&#10;Keluarga Besar Bpk. B"
				>{data.invitation.respect_person || ''}</textarea>
			</div>

			<h3 class="col-title" style="margin-top: 1.5rem">🎨 Media Utama</h3>
			<div class="form-group">
				<label for="background_image">Background Halaman Depan (URL Foto)</label>
				<p class="sub" style="margin-bottom:0.5rem">Masukkan URL foto (satu per baris). Ambil URL dari menu <a href="/dashboard/media" target="_blank" style="color: var(--dash-accent); text-decoration: underline;">Kelola Media</a>.</p>
				<textarea
					id="background_image"
					name="background_image"
					class="form-control"
					rows="3"
					placeholder="https://.../foto1.jpg&#10;https://.../foto2.jpg"
					oninput={e => handleUrlChange(e, 'bg')}
				>{data.invitation.background_image || ''}</textarea>

				<div class="photo-preview grid" style="margin-top: 1rem">
					{#each bgPreviews as src}
						<img src={src} alt="Background Preview" />
					{/each}
				</div>
			</div>

			<div class="form-group">
				<label for="gallery_images">Galeri Pre-Wedding (URL Foto)</label>
				<p class="sub" style="margin-bottom:0.5rem">Masukkan URL foto galeri (satu per baris). Ambil URL dari menu <a href="/dashboard/media" target="_blank" style="color: var(--dash-accent); text-decoration: underline;">Kelola Media</a>.</p>
				<textarea
					id="gallery_images"
					name="gallery_images"
					class="form-control"
					rows="5"
					placeholder="https://.../galeri1.jpg&#10;https://.../galeri2.jpg"
					oninput={e => handleUrlChange(e, 'gallery')}
				>{data.invitation.gallery_images || ''}</textarea>

				<div class="photo-preview grid" style="margin-top: 1rem">
					{#each galleryPreviews as src}
						<img src={src} alt="Gallery Preview" />
					{/each}
				</div>
			</div>

			<div class="form-group">
				<label for="music_url">Musik Latar (URL .mp3)</label>
				<input id="music_url" name="music_url" class="form-control" placeholder="https://.../music.mp3" value={data.invitation.music_url || ''} />
			</div>

			<button type="submit" class="btn btn-primary" style="margin-top: 1.5rem;">💾 Simpan Perubahan</button>
		</form>
	</div>
{/if}

<!-- Teks Tab -->
{#if activeTab === 'text'}
	<div class="dash-card">
		<form method="POST" action="?/update">
            <h3 class="col-title" style="margin-bottom: 1rem">✍️ Kustomisasi Teks</h3>
			<div class="form-group">
				<label for="custom_title">Judul Utama</label>
				<input id="custom_title" name="custom_content[title]" class="form-control" value={customContent.title || ''} oninput={e => customContent.title = e.currentTarget.value} />
			</div>
			<div class="form-group">
				<label for="custom_heading">Heading Mempelai</label>
				<input id="custom_heading" name="custom_content[heading]" class="form-control" value={customContent.heading || ''} oninput={e => customContent.heading = e.currentTarget.value} />
			</div>
			<div class="form-group">
				<label for="custom_invitation_text">Teks Undangan</label>
				<textarea id="custom_invitation_text" name="custom_content[invitation_text]" class="form-control" rows="5" oninput={e => customContent.invitation_text = e.currentTarget.value}>{customContent.invitation_text || ''}</textarea>
			</div>
			<!-- Simpan sebagai JSON string tunggal ke kolom 'custom_content' -->
			<input type="hidden" name="custom_content" value={JSON.stringify(customContent)} />
			<button type="submit" class="btn btn-primary" style="margin-top: 1rem;" onmouseenter={() => {
                const hiddenInput = document.querySelector('input[name="custom_content"]') as HTMLInputElement;
                hiddenInput.value = JSON.stringify(customContent);
            }}>💾 Simpan Teks</button>
		</form>
	</div>
{/if}

<!-- Guests Tab -->
{#if activeTab === 'guests'}
	<div class="dash-card">
		<div class="guests-toolbar">
			<form method="POST" action="?/addGuest" class="add-guest-form">
				<input name="guest_name" class="form-control" placeholder="Nama tamu..." required />
				<button type="submit" class="btn btn-primary btn-sm">+ Tambah</button>
			</form>

			<div class="search-guest">
				<input
					type="text"
					class="form-control search-input"
					placeholder="🔍 Cari nama tamu..."
					bind:value={searchQuery}
				/>
			</div>
		</div>

		{#if data.guests.length === 0}
			<p class="empty-text">Belum ada tamu yang ditambahkan</p>
		{:else if filteredGuests.length === 0}
			<p class="empty-text">Tamu dengan nama "{searchQuery}" tidak ditemukan</p>
		{:else}
			<table class="dash-table">
				<thead>
					<tr>
						<th>Nama</th>
						<th>Link</th>
						<th>Status</th>
						<th>Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredGuests as guest}
						<tr>
							<td>{guest.name}</td>
							<td>
								<button type="button" class="guest-link-btn" onclick={() => copyGuestLink(guest.name)} title="Klik untuk mengcopy link">
									📋 <span>/invitation/{data.invitation.slug}?to={encodeURIComponent(guest.name)}</span>
								</button>
							</td>
							<td>
								<span class="badge {guest.has_responded ? 'badge-success' : 'badge-warning'}">
									{guest.has_responded ? (guest.is_attending ? 'Hadir' : 'Tidak Hadir') : 'Belum Respon'}
								</span>
							</td>
							<td>
								<form method="POST" action="?/deleteGuest" style="display:inline">
									<input type="hidden" name="guest_id" value={guest.id} />
									<button type="submit" class="btn btn-danger btn-sm">Hapus</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
{/if}

<!-- Wishes Tab -->
{#if activeTab === 'wishes'}
	<div class="dash-card">
		{#if data.wishes.length === 0}
			<p class="empty-text">Belum ada ucapan</p>
		{:else}
			<div class="wishes-list">
				{#each data.wishes as wish}
					<div class="wish-item">
						<div class="wish-header">
							<strong>{wish.guest_name}</strong>
							<span class="badge {wish.is_attending === 'hadir' ? 'badge-success' : 'badge-warning'}">{wish.is_attending}</span>
						</div>
						<p class="wish-message">{wish.message}</p>
						<span class="wish-date">{new Date(wish.created_at).toLocaleDateString('id-ID')}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<!-- Settings Tab -->
{#if activeTab === 'settings'}
	<div class="dash-card danger-zone">
		<h3>⚠️ Zona Berbahaya</h3>
		<p>Menghapus undangan akan menghapus semua data termasuk tamu dan ucapan.</p>
		<button type="button" class="btn btn-danger" onclick={() => showDeleteConfirm = true}>
			🗑️ Hapus Undangan
		</button>
	</div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
	<div
		class="modal-backdrop"
		role="button"
		tabindex="0"
		onclick={() => showDeleteConfirm = false}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') showDeleteConfirm = false;
			if (e.key === 'Escape') showDeleteConfirm = false;
		}}
	>
		<div
			class="confirm-modal"
			role="dialog"
			aria-modal="true"
			tabindex="0"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<div class="modal-icon">⚠️</div>
			<h3>Hapus Undangan?</h3>
			<p class="confirm-message">
				Apakah Anda yakin ingin menghapus undangan <strong>"{data.invitation.bride_name} & {data.invitation.groom_name}"</strong>?
			</p>
			<p class="confirm-warning">
				🚫 Tindakan ini tidak dapat dibatalkan. Semua data termasuk tamu dan ucapan akan dihapus permanen.
			</p>
			<div class="modal-actions">
				<button
					type="button"
					class="btn btn-cancel"
					onclick={() => showDeleteConfirm = false}
				>
					✕ Batal
				</button>
				<form method="POST" action="?/delete" style="display:inline">
					<button type="submit" class="btn btn-delete-confirm">
						🗑️ Ya, Hapus Sekarang
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}

<style>
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}
	.stat-card {
		background: var(--dash-surface);
		border: 1px solid var(--dash-border);
		border-radius: 12px;
		padding: 1rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		transition: transform 0.2s;
	}
	.stat-card:hover {
		transform: translateY(-2px);
	}
	.stat-icon {
		font-size: 1.5rem;
	}
	.stat-value {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--dash-accent);
		line-height: 1;
	}
	.stat-label {
		font-size: 0.8rem;
		color: var(--dash-text-muted);
	}
	.sub {
		color: var(--dash-text-muted);
		font-size: 0.9rem;
		margin-top: 0.25rem;
	}
	.header-actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
	.tabs {
		display: flex;
		gap: 0.25rem;
		margin-bottom: 1.5rem;
		background: var(--dash-surface);
		border: 1px solid var(--dash-border);
		border-radius: 10px;
		padding: 0.3rem;
	}
	.tab {
		padding: 0.5rem 1rem;
		border-radius: 8px;
		color: var(--dash-text-muted);
		font-size: 0.85rem;
		font-weight: 500;
		transition: all 0.2s;
	}
	.tab.active {
		background: var(--dash-accent);
		color: white;
	}
	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}
	@media (max-width: 700px) {
		.form-row { grid-template-columns: 1fr; }
	}
	.col-title {
		font-size: 1rem;
		margin-bottom: 1rem;
		color: var(--dash-text);
	}
	.guests-toolbar {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}
	@media (min-width: 600px) {
		.guests-toolbar {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
		.add-guest-form {
			margin-bottom: 0;
			flex: 1;
			max-width: 400px;
		}
		.search-guest {
			flex: 1;
			max-width: 300px;
		}
	}

	.add-guest-form {
		display: flex;
		gap: 0.5rem;
	}
	.add-guest-form .form-control {
		flex: 1;
	}
	.search-input {
		background: #fff;
		border: 1px solid var(--dash-border);
		width: 100%;
	}
	.guest-link-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.75rem;
		background: var(--dash-bg);
		padding: 0.3rem 0.6rem;
		border-radius: 6px;
		border: 1px dashed var(--dash-border);
		color: var(--dash-text);
		cursor: pointer;
		font-family: monospace;
		transition: all 0.2s;
		max-width: 250px;
	}
	.guest-link-btn:hover {
		background: rgba(108, 99, 255, 0.1);
		border-color: var(--dash-accent);
	}
	.guest-link-btn span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.empty-text {
		text-align: center;
		color: var(--dash-text-muted);
		padding: 2rem;
	}
	.wishes-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.wish-item {
		padding: 1rem;
		background: var(--dash-bg);
		border-radius: 10px;
	}
	.wish-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	.wish-message {
		color: var(--dash-text-muted);
		font-size: 0.9rem;
		line-height: 1.5;
		margin-bottom: 0.5rem;
	}
	.wish-date {
		font-size: 0.75rem;
		color: var(--dash-text-muted);
	}
	.photo-upload {
		margin-top: 1rem;
	}
	.photo-preview {
		width: 100px;
		height: 100px;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid var(--dash-border);
		margin-bottom: 0.5rem;
		background: #f1f1f1;
	}
	.photo-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.photo-preview.grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		width: 100%;
		height: auto;
		background: transparent;
		border: none;
	}
	.photo-preview.grid img {
		width: 60px;
		height: 60px;
		border-radius: 4px;
		border: 1px solid var(--dash-border);
	}
	/* Form Controls */
	.form-group {
		margin-bottom: 1.5rem;
	}
	.form-group label {
		display: block;
		font-weight: 600;
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
		color: var(--dash-text);
	}
	.form-control {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 1px solid var(--dash-border);
		border-radius: 8px;
		font-family: inherit;
		font-size: 0.95rem;
		transition: all 0.2s;
		background: #fdfdfd; /* Very soft off-white, almost gray */
		color: var(--dash-text);
	}
	.form-control:focus {
		outline: none;
		background: white;
		border-color: var(--dash-accent);
		box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
	}

	input[type="date"], input[type="time"] {
		cursor: pointer;
		position: relative;
		background: #161625 !important;
		color: white !important;
		border: 1px solid rgba(255,255,255,0.1) !important;
	}

	input[type="date"]::-webkit-calendar-picker-indicator,
	input[type="time"]::-webkit-calendar-picker-indicator {
		cursor: pointer;
		padding: 5px;
		filter: invert(1); /* Makes the icon WHITE for dark theme */
	}

	input[type="date"]:hover, input[type="time"]:hover {
		border-color: var(--dash-accent);
		background-color: #f9f9ff;
	}

	textarea.form-control {
		resize: vertical;
		min-height: 100px;
	}

	/* Dark Theme Detail Page Overrides */
	:global(.dash-card) {
		background: #1e1e2e !important;
		border: 1px solid rgba(255,255,255,0.05) !important;
		color: #eee !important;
	}

	.tabs {
		background: #161625;
		border: 1px solid rgba(255,255,255,0.05);
	}

	.tab {
		color: #888;
	}
	.tab.active {
		background: var(--dash-accent);
		color: white;
	}

	.form-group label {
		color: #bbb;
	}

	.form-control {
		background: #161625;
		border: 1px solid rgba(255,255,255,0.1);
		color: #ffffff;
	}

	.form-control:focus {
		background: #1a1a2a;
		border-color: var(--dash-accent);
	}

	.sub {
		color: #777;
	}

	.col-title {
		color: #eee;
	}

	.photo-preview {
		background: #2a2a3a;
		border-color: rgba(255,255,255,0.1);
	}

	textarea.form-control {
		resize: vertical;
		min-height: 100px;
	}
	.template-grid-edit {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 0.75rem;
		margin-bottom: 2rem;
	}
	.template-option {
		cursor: pointer;
		border: 2px solid transparent;
		border-radius: 12px;
		overflow: hidden;
		transition: all 0.2s;
		background: rgba(255,255,255,0.02);
		position: relative;
	}
	.template-option.active {
		border-color: var(--dash-accent);
		background: rgba(108, 99, 255, 0.05);
	}
	.template-preview {
		aspect-ratio: 3/4;
		overflow: hidden;
		position: relative;
	}
	.template-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s;
	}
	.template-option:hover .template-preview img {
		transform: scale(1.05);
	}
	.template-info {
		padding: 0.75rem;
		text-align: center;
	}
	.template-name {
		font-size: 0.8rem;
		font-weight: 600;
		color: #fff;
	}
	.selected-badge {
		position: absolute;
		top: 5px;
		right: 5px;
		background: var(--dash-accent);
		color: white;
		padding: 2px 8px;
		border-radius: 10px;
		font-size: 0.6rem;
		font-weight: 700;
		box-shadow: 0 2px 5px rgba(0,0,0,0.3);
	}
	.btn-preview-small {
		background: rgba(255,255,255,0.1);
		border: 1px solid rgba(255,255,255,0.1);
		color: var(--dash-text-muted);
		font-size: 0.7rem;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		cursor: pointer;
		margin-top: 0.5rem;
		display: block;
		width: fit-content;
	}
	.btn-preview-small:hover {
		background: var(--dash-bg);
		color: var(--dash-text);
	}

	/* Modal Styles */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.8);
		backdrop-filter: blur(5px);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}
	.preview-modal {
		background: var(--dash-surface);
		width: 100%;
		max-width: 600px;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
		animation: modalFadeIn 0.3s ease;
	}
	@keyframes modalFadeIn {
		from { opacity: 0; transform: scale(0.95); }
		to { opacity: 1; transform: scale(1); }
	}
	.modal-header {
		padding: 1.25rem;
		border-bottom: 1px solid var(--dash-border);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.modal-header h3 {
		margin: 0;
		font-size: 1.1rem;
	}
	.close-btn {
		background: none;
		border: none;
		color: var(--dash-text-muted);
		font-size: 1.25rem;
		cursor: pointer;
	}
	.modal-body.demo-body {
		padding: 0;
		background: #f1f5f9;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.iframe-container {
		width: 100%;
		max-width: 414px;
		height: 750px;
		margin: 1.5rem auto;
		border-radius: 40px;
		overflow: hidden;
		border: 10px solid #1e293b;
		box-shadow: 0 15px 35px rgba(0,0,0,0.2);
		background: white;
	}
	.iframe-container iframe {
		width: 100%;
		height: 100%;
	}
	.preview-details {
		padding: 1.25rem;
		background: var(--dash-surface);
		width: 100%;
		border-top: 1px solid var(--dash-border);
		font-size: 0.9rem;
		color: var(--dash-text-muted);
	}
	.modal-footer {
		padding: 1.25rem;
		border-top: 1px solid var(--dash-border);
	}
	/* Delete Confirmation Modal */
	.confirm-modal {
		background: var(--dash-surface);
		padding: 2rem;
		border-radius: 16px;
		max-width: 480px;
		text-align: center;
		box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
		animation: modalSlideIn 0.3s ease;
	}
	@keyframes modalSlideIn {
		from { opacity: 0; transform: translateY(-20px) scale(0.95); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}
	.modal-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}
	.confirm-modal h3 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		color: var(--dash-text);
	}
	.confirm-message {
		color: var(--dash-text-muted);
		margin-bottom: 1rem;
		line-height: 1.6;
	}
	.confirm-message strong {
		color: var(--dash-primary);
	}
	.confirm-warning {
		background: rgba(231, 76, 60, 0.1);
		color: var(--color-danger);
		padding: 0.75rem 1rem;
		border-radius: 8px;
		font-size: 0.875rem;
		margin-bottom: 1.5rem;
		border-left: 3px solid var(--color-danger);
	}
	.modal-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
		margin-top: 1.5rem;
	}
	.modal-actions .btn {
		flex: 1;
		max-width: 160px;
		padding: 0.75rem 1.25rem;
		font-weight: 600;
		font-size: 0.9rem;
		border-radius: 10px;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}
	.btn-cancel {
		background: var(--dash-surface-hover);
		color: var(--dash-text);
		border: 2px solid var(--dash-border);
	}
	.btn-cancel:hover {
		background: var(--dash-border);
		border-color: var(--dash-text-muted);
		transform: translateY(-2px);
	}
	.btn-delete-confirm {
		background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
		color: white;
		border: 2px solid transparent;
		box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
	}
	.btn-delete-confirm:hover {
		background: linear-gradient(135deg, #c0392b 0%, #a93226 100%);
		box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
		transform: translateY(-2px);
	}
	.btn-cancel:active,
	.btn-delete-confirm:active {
		transform: translateY(0);
	}
</style>
