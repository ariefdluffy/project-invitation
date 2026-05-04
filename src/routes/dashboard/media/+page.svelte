<script lang="ts">
import type { PageData, ActionData } from './$types';
import { invalidateAll } from '$app/navigation';
import { enhance } from '$app/forms';
import { toast } from '$lib/toast.svelte';

let { data, form }: { data: PageData; form: ActionData } = $props();

let deleteConfirmModal = $state<{ open: boolean; fileName: string; fileUrl: string }>({ open: false, fileName: '', fileUrl: '' });
let isUploading = $state(false);
let isDeleting = $state(false);
let uploadProgress = $state(0);
let uploadMessage = $state({ type: '', text: '' });
let fileInput: HTMLInputElement;
let selectedPreview = $state<string | null>(null);
const MAX_FILE_SIZE = 1024 * 1024;
const MAX_FILE_SIZE_LABEL = '1MB';

function onFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        if (file.size > MAX_FILE_SIZE) {
            uploadMessage = { type: 'error', text: `Ukuran file melebihi batas ${MAX_FILE_SIZE_LABEL}.` };
            input.value = '';
            selectedPreview = null;
            return;
        }
        selectedPreview = URL.createObjectURL(file);
        uploadMessage = { type: '', text: '' };
    }
}

async function copyUrl(url: string) {
    try {
        await navigator.clipboard.writeText(window.location.origin + url);
        toast.success('URL berhasil disalin!');
    } catch (e) {
        toast.error('Gagal menyalin URL');
    }
}

function handleUpload(event: Event) {
    event.preventDefault();
    const formEl = event.target as HTMLFormElement;
    const formData = new FormData(formEl);
    const file = formData.get('file') as File;
    if (!file || file.size === 0) return;
    if (file.size > MAX_FILE_SIZE) {
        uploadMessage = { type: 'error', text: `Ukuran file melebihi batas ${MAX_FILE_SIZE_LABEL}.` };
        if (fileInput) fileInput.value = '';
        selectedPreview = null;
        return;
    }

    isUploading = true;
    uploadProgress = 0;
    uploadMessage = { type: '', text: '' };

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
            uploadProgress = Math.round((e.loaded / e.total) * 100);
        }
    });

    xhr.addEventListener('load', () => {
        isUploading = false;
        if (xhr.status >= 200 && xhr.status < 300) {
            uploadMessage = { type: 'success', text: 'Foto berhasil diupload!' };
            if (fileInput) fileInput.value = '';
            selectedPreview = null;
            invalidateAll();
        } else {
            uploadMessage = { type: 'error', text: 'Gagal mengupload foto.' };
        }
    });

    xhr.open('POST', formEl.action);
    xhr.send(formData);
}

const deleteEnhance = () => {
    isDeleting = true;
    return async ({ result, update }) => {
        if (result.type === 'success') {
            toast.success('Foto berhasil dihapus');
            deleteConfirmModal = { open: false, fileName: '', fileUrl: '' };
            await invalidateAll();
        } else if (result.type === 'failure') {
            toast.error('Gagal menghapus foto');
        }
        isDeleting = false;
        await update();
    };
};
</script>

<svelte:head>
	<title>Media & Foto - {data.appName}</title>
</svelte:head>

<div class="dash-header">
<div>
<h1>📸 Kelola Foto</h1>
<p class="dash-header-sub">Upload foto mempelai untuk digunakan di undanganmu</p>
</div>
</div>

<div class="upload-section dash-card">
<form 
method="POST" 
action="?/upload" 
enctype="multipart/form-data" 
onsubmit={handleUpload}
class="upload-form"
>
<div class="file-input-wrapper">
<input 
type="file" 
name="file" 
id="file" 
accept=".jpg,.jpeg,.png,image/jpeg,image/png" 
required 
bind:this={fileInput}
onchange={onFileSelect}
class="file-input"
/>
<div class="upload-prompt" class:has-preview={selectedPreview}>
{#if selectedPreview}
<div class="preview-container animate-pop">
<img src={selectedPreview} alt="Selected Preview" />
<div class="preview-overlay">Siap Upload</div>
</div>
{:else}
<div class="upload-icon">📁</div>
<p>Pilih foto atau drag & drop ke sini</p>
<span class="upload-hint">Maksimal 1MB. Format: JPG, PNG</span>
{/if}
</div>
</div>

{#if isUploading}
<div class="progress-container">
<div class="progress-bar" style="width: {uploadProgress}%"></div>
<span class="progress-text">{uploadProgress}%</span>
</div>
{/if}

<button type="submit" class="btn btn-primary" disabled={isUploading}>
{isUploading ? 'Mengupload...' : '📤 Upload Foto'}
</button>
</form>

{#if uploadMessage.text}
<div class="alert alert-{uploadMessage.type}" style="margin-top: 1rem;">
{uploadMessage.text}
</div>
{/if}
</div>

<div class="gallery-section">
<h2>Galeri Foto Saya ({data.files.length})</h2>

{#if data.files.length === 0}
<div class="empty-state">
<div class="empty-icon">🖼️</div>
<h3>Belum ada foto</h3>
<p>Upload foto pertamamu di atas</p>
</div>
{:else}
<div class="gallery-grid">
{#each data.files as file}
<div class="gallery-item dash-card">
<div class="img-wrapper">
<img src={file.url} alt={file.name} loading="lazy" />
</div>
<div class="file-info">
<p class="file-name" title={file.name}>{file.name}</p>
<p class="file-size">{(file.size / 1024).toFixed(1)} KB</p>
</div>
<div class="file-actions">
<button class="btn btn-secondary btn-sm w-full" onclick={() => copyUrl(file.url)}>
📋 Copy URL
</button>
<button class="btn btn-danger btn-sm w-full" onclick={() => deleteConfirmModal = { open: true, fileName: file.name, fileUrl: file.url }}>
🗑️ Hapus
</button>
</div>
</div>
{/each}
</div>
{/if}
</div>

<!-- Delete Confirmation Modal -->
{#if deleteConfirmModal.open}
<div
 class="modal-backdrop"
 role="button"
 tabindex="0"
 onclick={() => deleteConfirmModal = { open: false, fileName: '', fileUrl: '' }}
 onkeydown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') deleteConfirmModal = { open: false, fileName: '', fileUrl: '' };
  if (e.key === 'Escape') deleteConfirmModal = { open: false, fileName: '', fileUrl: '' };
 }}
>
<div
 class="delete-modal"
 role="dialog"
 aria-modal="true"
 tabindex="0"
 onclick={(e) => e.stopPropagation()}
 onkeydown={(e) => e.stopPropagation()}
>
<div class="modal-icon">
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="3 6 5 6 21 6"></polyline>
<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
<line x1="10" y1="11" x2="10" y2="17"></line>
<line x1="14" y1="11" x2="14" y2="17"></line>
</svg>
</div>

<h3 class="modal-title">Hapus Foto?</h3>
<p class="modal-desc">
Apakah Anda yakin ingin menghapus foto <strong>"{deleteConfirmModal.fileName}"</strong>?
</p>
<p class="modal-warning">
⚠️ Aksi ini tidak dapat dibatalkan. Foto akan dihapus permanen dari galeri.
</p>

<div class="modal-actions">
<button class="btn btn-cancel" onclick={() => deleteConfirmModal = { open: false, fileName: '', fileUrl: '' }}>
Batal
</button>
<form method="POST" action="?/delete" use:enhance={deleteEnhance}>
<input type="hidden" name="fileName" value={deleteConfirmModal.fileName} />
<button type="submit" class="btn btn-delete-confirm" disabled={isDeleting}>
{isDeleting ? "Menghapus..." : "🗑️ Ya, Hapus Sekarang"}
</button>
</form>
</div>
</div>
</div>
{/if}

<style>
.dash-header-sub {
color: var(--dash-text-muted);
font-size: 0.95rem;
margin-top: 0.25rem;
}

.upload-section {
margin-bottom: 2rem;
}

.upload-form {
display: flex;
flex-direction: column;
gap: 1rem;
align-items: flex-start;
}

.file-input-wrapper {
position: relative;
width: 100%;
border: 2px dashed var(--dash-border);
border-radius: 12px;
background: rgba(0,0,0,0.02);
transition: all 0.3s;
}

.file-input-wrapper:hover {
border-color: var(--dash-accent);
background: rgba(108, 99, 255, 0.05);
}

.file-input {
position: absolute;
inset: 0;
width: 100%;
height: 100%;
opacity: 0;
cursor: pointer;
z-index: 10;
}

.upload-prompt {
padding: 3rem 1rem;
text-align: center;
pointer-events: none;
}

.upload-icon {
font-size: 2.5rem;
margin-bottom: 0.5rem;
}

.upload-prompt.has-preview {
padding: 1rem;
}

.preview-container {
width: 100%;
max-width: 250px;
margin: 0 auto;
aspect-ratio: 1;
border-radius: 12px;
overflow: hidden;
position: relative;
box-shadow: var(--shadow-md);
}

.preview-container img {
width: 100%;
height: 100%;
object-fit: cover;
}

.preview-overlay {
position: absolute;
bottom: 0;
left: 0;
right: 0;
background: rgba(108, 99, 255, 0.9);
color: white;
padding: 0.5rem;
font-size: 0.8rem;
font-weight: 700;
text-transform: uppercase;
}

@keyframes pop {
from { transform: scale(0.9); opacity: 0; }
to { transform: scale(1); opacity: 1; }
}

.animate-pop {
transform: none;
}

.gallery-section h2 {
font-family: var(--font-serif);
font-size: 1.3rem;
margin-bottom: 1.5rem;
}

.gallery-grid {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
gap: 1rem;
}

.gallery-item {
padding: 0.75rem;
display: flex;
flex-direction: column;
gap: 0.75rem;
}

.img-wrapper {
width: 100%;
aspect-ratio: 1;
border-radius: 8px;
overflow: hidden;
background: var(--dash-bg);
display: flex;
align-items: center;
justify-content: center;
}

.img-wrapper img {
width: 100%;
height: 100%;
object-fit: cover;
}

.file-info {
flex: 1;
}

.file-name {
font-size: 0.85rem;
font-weight: 500;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

.file-size {
font-size: 0.75rem;
color: var(--dash-text-muted);
}

.file-actions {
display: flex;
flex-direction: column;
gap: 0.5rem;
}

.w-full {
width: 100%;
}

.empty-state {
text-align: center;
padding: 3rem 1rem;
background: var(--dash-surface);
border-radius: 12px;
border: 1px dashed var(--dash-border);
}
.empty-icon {
font-size: 3rem;
margin-bottom: 1rem;
}

.progress-container {
width: 100%;
background-color: #eee;
border-radius: 8px;
position: relative;
height: 24px;
overflow: hidden;
margin-top: 0.5rem;
}

.progress-bar {
height: 100%;
background: linear-gradient(90deg, var(--color-primary), var(--dash-accent));
transition: width 0.3s ease;
}

.progress-text {
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
font-size: 0.75rem;
font-weight: bold;
color: #333;
text-shadow: 0 0 2px rgba(255,255,255,0.8);
}

/* Delete Confirmation Modal */

	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(2px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
        transition: opacity 0.2s;
	}

@keyframes fadeIn {
from { opacity: 0; }
to { opacity: 1; }
}

.delete-modal {
background: white;
border-radius: 16px;
padding: 2rem;
max-width: 420px;
width: 100%;
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
transform: none;
}

@keyframes slideUp {
from { transform: translateY(20px); opacity: 0; }
to { transform: translateY(0); opacity: 1; }
}

.modal-icon {
width: 80px;
height: 80px;
margin: 0 auto 1.5rem;
background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
color: #dc2626;
}

.modal-title {
font-size: 1.5rem;
font-weight: 700;
color: #1e293b;
text-align: center;
margin: 0 0 0.75rem 0;
}

.modal-desc {
font-size: 0.95rem;
color: #64748b;
text-align: center;
margin: 0 0 1rem 0;
line-height: 1.6;
}

.modal-desc strong {
color: #1e293b;
word-break: break-word;
}

.modal-warning {
background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
border-left: 3px solid #f59e0b;
padding: 0.875rem 1rem;
border-radius: 8px;
font-size: 0.875rem;
color: #92400e;
margin: 0 0 1.5rem 0;
}

.modal-actions {
display: flex;
gap: 0.75rem;
}

.btn-cancel {
flex: 1;

padding: 0.875rem 1.5rem;
background: #f1f5f9;
color: #475569;
border: none;
border-radius: 10px;
font-size: 0.95rem;
font-weight: 600;
cursor: pointer;
transition: all 0.2s ease;
}

.btn-cancel:hover {
background: #e2e8f0;
transform: translateY(-1px);
}

.btn-delete-confirm {
flex: 1.5;
padding: 0.875rem 1.5rem;
background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
color: white;
border: none;
border-radius: 10px;
font-size: 0.95rem;
font-weight: 600;
cursor: pointer;
transition: all 0.2s ease;
box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.btn-delete-confirm:hover {
transform: translateY(-2px);
box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
}
</style>
