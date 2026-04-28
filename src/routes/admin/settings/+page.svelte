<script lang="ts">
	import type { PageData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/toast.svelte';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	const settingsEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				const d = result.data as { message?: string } | undefined;
				if (d?.message) {
					toast.success(d.message);
					await invalidateAll();
				}
			} else if (result.type === 'failure') {
				const d = result.data as { error?: string } | undefined;
				if (d?.error) toast.error(d.error);
			}
		};
	};
</script>

<svelte:head><title>Settings - Admin {data.appName}</title></svelte:head>

<div class="dash-header">
	<div>
		<h1>⚙️ App Settings</h1>
		<p class="dash-header-sub">Atur konfigurasi aplikasi, harga, dan skema pembayaran</p>
	</div>
</div>

<div class="settings-grid">
	<div class="dash-card">
		<form method="POST" action="?/update" use:enhance={settingsEnhance}>
			<h3 class="section-title">💰 Pengaturan Harga & Pembayaran</h3>
			
			<div class="form-row">
				<div class="form-group">
					<label for="premium_price">Harga Paket Premium (Rp)</label>
					<p class="field-desc">Harga aktivasi akses premium</p>
					<input type="number" id="premium_price" name="premium_price" class="form-control" value={data.settings.premium_price} required />
				</div>

				<div class="form-group">
					<label for="addon_guest_price">Harga Add-on Tamu (Rp)</label>
					<p class="field-desc">Harga per paket tambah kuota</p>
					<input type="number" id="addon_guest_price" name="addon_guest_price" class="form-control" value={data.settings.addon_guest_price} required />
				</div>
				
				<div class="form-group">
					<label for="addon_guest_quantity">Jumlah Tamu Add-on</label>
					<p class="field-desc">Kenaikan kuota per pembelian</p>
					<input type="number" id="addon_guest_quantity" name="addon_guest_quantity" class="form-control" value={data.settings.addon_guest_quantity} required />
				</div>
			</div> <!-- Close the first form-row -->

			<div class="form-row"> <!-- Open a new form-row for template expansion -->
				<div class="form-group">
					<label for="template_expansion_price">Harga Ekspansi Kuota Undangan (Rp)</label>
					<p class="field-desc">Harga per paket ekspansi template</p>
					<input type="number" id="template_expansion_price" name="template_expansion_price" class="form-control" value={data.settings.template_expansion_price} required />
				</div>

				<div class="form-group">
					<label for="template_expansion_quantity">Jumlah Template Ekspansi</label>
					<p class="field-desc">Kenaikan kuota template per pembelian</p>
					<input type="number" id="template_expansion_quantity" name="template_expansion_quantity" class="form-control" value={data.settings.template_expansion_quantity} required />
				</div>
			</div>

			<h3 class="section-title" style="margin-top: 3rem;">🛰️ Konfigurasi Midtrans API</h3>
			
			<div class="form-group">
				<label for="midtrans_server_key">Midtrans Server Key</label>
				<input type="password" id="midtrans_server_key" name="midtrans_server_key" class="form-control" value={data.settings.midtrans_server_key || ''} placeholder="SB-Mid-server-..." />
			</div>

			<div class="form-group">
				<label for="midtrans_client_key">Midtrans Client Key</label>
				<input type="text" id="midtrans_client_key" name="midtrans_client_key" class="form-control" value={data.settings.midtrans_client_key || ''} placeholder="SB-Mid-client-..." />
			</div>

			<div class="form-group">
				<label for="midtrans_is_production">Mode Lingkungan</label>
				<select name="midtrans_is_production" class="form-control">
					<option value="0" selected={data.settings.midtrans_is_production === '0'}>Sandbox (Testing)</option>
					<option value="1" selected={data.settings.midtrans_is_production === '1'}>Production (Live)</option>
				</select>
			</div>

			<div class="form-group" style="margin-top: 2rem;">
				<label for="app_name">Nama Aplikasi / Brand</label>
				<input 
					type="text" 
					id="app_name" 
					name="app_name" 
					class="form-control" 
					value={data.settings.app_name} 
					required 
				/>
			</div>

			<div class="form-group">
				<label for="default_music_url">URL Musik Default (undangan baru)</label>
				<p class="field-desc">Dipakai saat pengguna membuat undangan tanpa mengisi musik. Isi URL audio langsung (mp3/wav).</p>
				<input
					type="url"
					id="default_music_url"
					name="default_music_url"
					class="form-control"
					value={data.settings.default_music_url || ''}
					placeholder="https://..."
				/>
			</div>

			<div class="form-group">
				<label for="payment_instructions">Instruksi Pembayaran Manual</label>
				<p class="field-desc">Akan ditampilkan jika pengguna menanyakan cara bayar manual</p>
				<textarea 
					id="payment_instructions" 
					name="payment_instructions" 
					class="form-control" 
					rows="4"
					placeholder="cth: Transfer ke Rekening BCA 123456 a.n Admin"
				>{data.settings.payment_instructions || ''}</textarea>
			</div>

			<div class="form-actions">
				<button type="submit" class="btn btn-primary">💾 Simpan Semua Pengaturan</button>
			</div>
		</form>
	</div>

	<div class="dash-card info-card">
		<div class="info-card-header">
			<div class="info-card-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="12" y1="16" x2="12" y2="12"></line>
					<line x1="12" y1="8" x2="12.01" y2="8"></line>
				</svg>
			</div>
			<div class="info-card-title">
				<h3>ℹ️ Info Skema & Pembayaran</h3>
				<p class="info-card-subtitle">Panduan konfigurasi sistem pembayaran</p>
			</div>
		</div>
		
		<div class="info-card-content">
			<div class="info-item">
				<div class="info-item-icon">💰</div>
				<div class="info-item-text">
					<strong>Format Harga</strong>
					<p>Gunakan angka saja tanpa titik atau koma (contoh: 150000, 39000)</p>
				</div>
			</div>
			
			<div class="info-item">
				<div class="info-item-icon">⚡</div>
				<div class="info-item-text">
					<strong>Otomatisasi Sistem</strong>
					<p>Saat ini menggunakan simulasi pembayaran. Pengaturan harga akan langsung diperbarui di halaman billing pengguna.</p>
				</div>
			</div>
			
			<div class="info-item">
				<div class="info-item-icon">🔧</div>
				<div class="info-item-text">
					<strong>Dampak Perubahan</strong>
					<p>Setiap perubahan harga akan langsung terlihat oleh semua pengguna aktif.</p>
				</div>
			</div>
		</div>
		
		<div class="info-card-footer">
			<div class="tip-box">
				<span class="tip-icon">💡</span>
				<span>Tip: Pastikan konfigurasi Midtrans sudah benar sebelum beralih ke mode Production</span>
			</div>
		</div>
	</div>
</div>

<style>
	.dash-header-sub {
		color: var(--dash-text-muted);
		font-size: 0.95rem;
		margin-top: 0.25rem;
	}
	
	.settings-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}
	
	@media (min-width: 900px) {
		.settings-grid {
			grid-template-columns: 1.5fr 1fr;
		}
	}
	
	.section-title {
		margin-bottom: 2rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--dash-border);
		font-family: var(--font-serif);
	}
	
	.field-desc {
		font-size: 0.8rem;
		color: var(--dash-text-muted);
		margin-bottom: 0.5rem;
	}
	
	.form-actions {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--dash-border);
	}
	
	.info-card {
		background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}
	
	.info-card-header {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
		margin-bottom: 1.25rem;
	}
	
	.info-card-icon {
		width: 48px;
		height: 48px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		flex-shrink: 0;
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	}
	
	.info-card-title h3 {
		font-size: 1.25rem;
		margin: 0 0 0.25rem 0;
		color: #1e293b;
		font-weight: 600;
	}
	
	.info-card-subtitle {
		font-size: 0.875rem;
		color: #64748b;
		margin: 0;
	}
	
	.info-card-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.info-item {
		display: flex;
		align-items: flex-start;
		gap: 0.875rem;
		padding: 0.875rem;
		background: rgba(255, 255, 255, 0.6);
		border-radius: 8px;
		transition: all 0.2s ease;
	}
	
	.info-item:hover {
		background: rgba(255, 255, 255, 0.8);
		transform: translateX(4px);
	}
	
	.info-item-icon {
		font-size: 1.5rem;
		flex-shrink: 0;
	}
	
	.info-item-text {
		flex: 1;
	}
	
	.info-item-text strong {
		display: block;
		color: #1e293b;
		font-size: 0.95rem;
		margin-bottom: 0.25rem;
	}
	
	.info-item-text p {
		margin: 0;
		color: #64748b;
		font-size: 0.875rem;
		line-height: 1.5;
	}
	
	.info-card-footer {
		margin-top: 1.25rem;
		padding-top: 1.25rem;
		border-top: 1px solid rgba(0, 0, 0, 0.06);
	}
	
	.tip-box {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
		border-left: 3px solid #f59e0b;
		border-radius: 8px;
		font-size: 0.875rem;
		color: #92400e;
	}
	
	.tip-icon {
		font-size: 1.25rem;
		flex-shrink: 0;
	}
	
	.info-list {
		padding-left: 1.2rem;
		font-size: 0.95rem;
		color: #334155;
		line-height: 1.6;
	}
	
	.info-list li {
		margin-bottom: 0.75rem;
	}
	.form-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-bottom: 1rem;
	}
</style>
