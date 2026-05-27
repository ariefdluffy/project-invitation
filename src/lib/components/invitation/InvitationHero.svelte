<script lang="ts">
	let {
		invitation,
		templateTitle,
		timeLeft
	}: {
		invitation: Record<string, any>;
		templateTitle: string;
		timeLeft: { d: number; h: number; m: number; s: number };
	} = $props();
</script>

<section class="section hero-sec reveal">
	<div class="hero-box">
		<p class="subtitle" style="font-family: var(--f-fam); letter-spacing: 0.3em; text-transform: uppercase; font-size: 0.9rem; opacity: 0.8; margin-bottom: 1rem;">
			{templateTitle}
		</p>
		<h2 class="names">
			{invitation.bride_name} <br />&<br />
			{invitation.groom_name}
		</h2>
		<p class="date">
			{invitation.akad_date
				? new Date(invitation.akad_date)
						.toLocaleDateString("id-ID", {
							day: "2-digit",
							month: "2-digit",
							year: "numeric",
						})
						.replace(/\//g, " . ")
				: ""}
		</p>

		<div class="countdown-container reveal delay-1">
			<div class="countdown-item">
				<span class="value">{timeLeft.d}</span>
				<span class="label">Hari</span>
			</div>
			<div class="countdown-item">
				<span class="value">{timeLeft.h}</span>
				<span class="label">Jam</span>
			</div>
			<div class="countdown-item">
				<span class="value">{timeLeft.m}</span>
				<span class="label">Menit</span>
			</div>
			<div class="countdown-item">
				<span class="value">{timeLeft.s}</span>
				<span class="label">Detik</span>
			</div>
		</div>
	</div>
</section>

<style>
	.hero-sec {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		max-width: 100%;
	}
	.hero-box {
		padding: 4rem 2rem;
		border: 1px solid rgba(255, 255, 255, 0.6);
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(10px);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		width: 90%;
		max-width: 600px;
	}
	.hero-box .names {
		font-size: clamp(3rem, 8vw, 4.5rem);
		line-height: 1.2;
		margin: 1.5rem 0;
		text-shadow: 0 2px 10px rgba(255, 255, 255, 0.8);
	}
	.hero-box .subtitle,
	.hero-box .date {
		text-shadow: 0 1px 5px rgba(255, 255, 255, 0.8);
		font-weight: 600;
	}

	.countdown-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-top: 2.5rem;
		width: 100%;
		max-width: 500px;
		margin-left: auto;
		margin-right: auto;
	}
	
	.countdown-item {
		background: white;
		padding: 1rem 0.5rem;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 4px 15px rgba(0,0,0,0.05);
		border: 1px solid rgba(0,0,0,0.05);
	}
	
	.countdown-item .value {
		font-family: var(--f-fam);
		font-size: 1.8rem;
		font-weight: 700;
		color: var(--p-col);
		line-height: 1;
		margin-bottom: 0.25rem;
	}
	
	.countdown-item .label {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-weight: 600;
		opacity: 0.7;
	}

	:global(.template-celestial-night .countdown-item) {
		background: rgba(255,255,255,0.1);
		backdrop-filter: blur(5px);
		border: 1px solid rgba(255,255,255,0.2);
		color: white;
	}
	:global(.template-celestial-night .countdown-item .value) { color: #ffd700; }

	:global(.template-royal-midnight .countdown-item) {
		background: rgba(255,255,255,0.1);
		color: white;
		border: 1px solid var(--s-col);
	}
	:global(.template-royal-midnight .countdown-item .value) { color: var(--s-col); }

	:global(.template-vintage-rustic .countdown-item) {
		background: #e0d5c1;
		border: 2px solid #8d6e63;
		border-radius: 0;
	}

	@media (max-width: 480px) {
		.countdown-container {
			gap: 0.5rem;
		}
		.countdown-item {
			padding: 0.75rem 0.25rem;
		}
		.countdown-item .value {
			font-size: 1.4rem;
		}
		.countdown-item .label {
			font-size: 0.6rem;
		}
	}

	:global(.template-royal-midnight .hero-box) {
		background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(0, 0, 0, 0.8));
		backdrop-filter: blur(15px);
		border: 1px solid rgba(192, 160, 128, 0.3);
		border-radius: 30px;
		padding: 3rem;
		box-shadow: 0 20px 50px rgba(0,0,0,0.5);
	}
</style>
