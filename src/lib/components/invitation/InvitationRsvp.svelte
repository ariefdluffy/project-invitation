<script lang="ts">
	import { enhance } from "$app/forms";

	let {
		form,
		wishes,
		guestName
	}: {
		form: { success?: boolean; error?: string } | null;
		wishes: Array<{ guest_name: string; is_attending: string; created_at: string; message: string }>;
		guestName: string;
	} = $props();
</script>

<section class="section rsvp-sec reveal">
	<div class="section-heading">
		<h2 class="title">RSVP & Wishes</h2>
		<p>
			Mohon berkenan untuk memberikan doa & ucapan untuk mempelai serta konfirmasi kehadiran dengan mengisi form berikut:
		</p>
	</div>

	<div class="form-container">
		{#if form?.success}
			<div class="alert alert-success">Terima kasih atas doa dan ucapannya! 🎉</div>
		{/if}
		{#if form?.error}
			<div class="alert alert-danger">{form.error}</div>
		{/if}

		<form method="POST" action="?/wish" use:enhance>
			<input
				type="text"
				name="guest_name"
				class="form-input"
				placeholder="Nama Anda"
				value={guestName}
				required
			/>
			<select name="is_attending" class="form-input" required>
				<option value="hadir">Hadir</option>
				<option value="tidak_hadir">Maaf, Tidak Bisa Hadir</option>
			</select>
			<textarea
				name="message"
				class="form-input"
				rows="4"
				placeholder="Tulis doa & ucapan selamat..."
				required
			></textarea>
			<button type="submit" class="btn-primary w-full">Kirim Ucapan</button>
		</form>
	</div>

	<div class="wishes-list">
		<h4 style="margin-bottom: 1rem; color: var(--p-col);">{wishes.length} Ucapan</h4>
		<div class="wishes-scroll">
			{#each wishes as wish}
				<div class="wish-card">
					<div class="wish-head">
						<strong>{wish.guest_name}</strong>
						<span class="wish-badge" class:hadir={wish.is_attending === "hadir"}>
							{wish.is_attending === "hadir" ? "Hadir" : "Tidak Hadir"}
						</span>
					</div>
					<div class="wish-date">{new Date(wish.created_at).toLocaleDateString("id-ID")}</div>
					<p class="wish-text">{wish.message}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.rsvp-sec {
		background: transparent;
	}
	.form-container {
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(12px);
		padding: 3rem 2rem;
		border-radius: 20px;
		margin-bottom: 3rem;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.6);
	}
	.form-input {
		width: 100%;
		padding: 1.2rem;
		margin-bottom: 1.2rem;
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 10px;
		font-family: inherit;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 0.8);
		font-size: 1rem;
		transition: border-color 0.2s;
	}
	.form-input:focus {
		outline: none;
		border-color: var(--p-col);
		background: #fff;
	}
	.w-full {
		width: 100%;
	}
	.alert {
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1rem;
	}
	.alert-success {
		background: #d4edda;
		color: #155724;
	}
	.alert-danger {
		background: #f8d7da;
		color: #721c24;
	}
	.wishes-scroll {
		max-height: 400px;
		overflow-y: auto;
		text-align: left;
		padding-right: 0.5rem;
	}
	.wish-card {
		padding: 1.2rem;
		background: #f9f9f9;
		border-radius: 12px;
		margin-bottom: 1rem;
		border-left: 4px solid var(--p-col);
	}
	.wish-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.3rem;
	}
	.wish-badge {
		font-size: 0.7rem;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		background: #eee;
	}
	.wish-badge.hadir {
		background: #d4edda;
		color: #155724;
	}
	.wish-date {
		font-size: 0.75rem;
		color: #888;
		margin-bottom: 0.8rem;
	}
	.wish-text {
		font-size: 0.9rem;
		line-height: 1.5;
	}
</style>
