<script lang="ts">
	let {
		invitation,
		customContent
	}: {
		invitation: Record<string, any>;
		customContent: Record<string, any>;
	} = $props();
</script>

<section class="section couple-sec">
	<div class="section-heading">
		<h2 class="title">{customContent.heading || 'Bride & Groom'}</h2>
		<p>
			{customContent.invitation_text || "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:"}
		</p>
	</div>

	<div class="couple-card bride reveal delay-1">
		<div
			class="avatar"
			style="background-image: url({invitation.bride_photo ||
				'https://images.unsplash.com/photo-1546803076-2675b871c828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'})"
		></div>
		<h3 class="name" style="font-family: var(--f-fam);">{invitation.bride_name}</h3>
		<p class="full-name">{invitation.bride_full_name}</p>
		<p class="parents">{invitation.bride_parents}</p>
		{#if invitation.bride_instagram}
			<a
				href="https://instagram.com/{invitation.bride_instagram.replace('@','')}"
				target="_blank"
				class="ig-link">📸 {invitation.bride_instagram}</a
			>
		{/if}
	</div>

	<div class="and-symbol">&</div>

	<div class="couple-card groom reveal delay-2">
		<div
			class="avatar"
			style="background-image: url({invitation.groom_photo ||
				'https://images.unsplash.com/photo-1550096141-7263640ae4d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'})"
		></div>
		<h3 class="name" style="font-family: var(--f-fam);">{invitation.groom_name}</h3>
		<p class="full-name">{invitation.groom_full_name}</p>
		<p class="parents">{invitation.groom_parents}</p>
		{#if invitation.groom_instagram}
			<a
				href="https://instagram.com/{invitation.groom_instagram.replace('@','')}"
				target="_blank"
				class="ig-link">📸 {invitation.groom_instagram}</a
			>
		{/if}
	</div>
</section>

<style>
	.couple-sec {
		display: flex;
		flex-direction: column;
	}
	.couple-card {
		margin-bottom: 2rem;
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(12px);
		padding: 3rem 2rem;
		border-radius: 24px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.6);
	}
	.avatar {
		width: 180px;
		height: 180px;
		margin: 0 auto 1.5rem;
		border-radius: 50%;
		background-size: cover;
		background-position: center;
		border: 5px solid white;
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
	}
	.couple-card .name {
		font-family: var(--f-fam);
		font-size: 2.2rem;
		color: var(--p-col);
		margin-bottom: 0.5rem;
		text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
	}
	.couple-card .full-name {
		font-weight: 600;
		margin-bottom: 0.5rem;
	}
	.ig-link {
		display: inline-block;
		margin-top: 1.5rem;
		padding: 0.6rem 1.2rem;
		background: var(--p-col);
		border-radius: 50px;
		color: white;
		font-size: 0.8rem;
		text-decoration: none;
		transition: transform 0.2s, opacity 0.2s;
	}
	.ig-link:hover {
		transform: translateY(-2px);
		opacity: 0.9;
	}
	.and-symbol {
		font-family: var(--f-fam);
		font-size: 4rem;
		color: var(--s-col);
		margin: 0;
		text-shadow: 0 2px 10px rgba(255, 255, 255, 0.8);
	}

	:global(.template-modern-minimalist .couple-card) {
		border-radius: 0;
		border-left: 4px solid var(--p-col);
		text-align: left;
		padding-left: 2rem;
	}
	:global(.template-modern-minimalist .avatar) {
		border-radius: 0;
		border: 1px solid var(--p-col);
	}

	:global(.template-javanese-elegance .couple-card) {
		border: 3px double var(--p-col);
		background: #fdf6e3;
		border-radius: 15px;
	}
	:global(.template-javanese-elegance .avatar) {
		border-radius: 50% 50% 0 0;
		border: 4px solid var(--p-col);
	}

	:global(.template-royal-midnight .couple-card) {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(192, 160, 128, 0.2);
		border-radius: 25px;
		padding: 2rem;
		transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}
	:global(.template-royal-midnight .couple-card:hover) {
		transform: translateY(-15px);
	}
	:global(.template-royal-midnight .avatar) {
		border: 4px solid var(--s-col);
		box-shadow: 0 0 20px rgba(192, 160, 128, 0.5);
	}

	:global(.template-tropical-breeze .avatar) {
		border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
		border: 5px solid var(--s-col);
	}
	:global(.template-tropical-breeze .couple-card) {
		background: rgba(255,255,255,0.7);
		backdrop-filter: blur(5px);
		border-radius: 40px;
	}

	:global(.template-minimalist-earth .couple-card) {
		border: none;
		background: #fefae0;
		box-shadow: none;
	}
	:global(.template-minimalist-earth .avatar) {
		border-radius: 20px;
		filter: grayscale(0.2);
	}

	:global(.template-garden-romance .couple-card) {
		border-radius: 50px 5px 50px 5px;
		background: rgba(255,255,255,0.9);
		border: 1px solid #ffc1e3;
	}
	:global(.template-garden-romance .avatar) {
		border-radius: 50%;
		box-shadow: 0 0 15px rgba(212, 132, 155, 0.3);
	}

	:global(.template-classic-elegance .avatar) {
		border-radius: 120px 120px 0 0;
		border: 2px solid #d4af37;
	}
	:global(.template-classic-elegance .couple-card) {
		border: 1px solid #d4af37;
		background: #ffffff;
	}

	:global(.template-soft-lavender .avatar) {
		border-radius: 40% 40% 50% 50%;
		border: 4px solid #e9d5ff;
	}
	:global(.template-soft-lavender .couple-card) {
		background: #faf5ff;
		border: 1px dashed #7e22ce;
	}

	:global(.template-vintage-rustic .couple-card) {
		background-image: url('https://www.transparenttextures.com/patterns/old-map.png');
		border: 2px solid #8d6e63;
		box-shadow: 5px 5px 0px #8d6e63;
	}
	:global(.template-vintage-rustic .avatar) {
		filter: sepia(0.5);
		border-radius: 0;
		border: 3px solid #8d6e63;
	}

	:global(.template-celestial-night .couple-card) {
		background: rgba(255,255,255,0.05);
		border: 1px solid rgba(255,255,255,0.2);
		backdrop-filter: blur(15px);
		color: white;
	}
	:global(.template-celestial-night .couple-card .name) { color: #ffd700; }
	:global(.template-celestial-night .avatar) {
		box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
		border: 2px solid #ffd700;
	}

	@media (max-width: 600px) {
		:global(.couple-card) {
			padding: 2rem 1.5rem;
		}
	}
</style>
