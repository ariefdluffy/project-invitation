<script lang="ts">
	let {
		invitation,
		formatDate
	}: {
		invitation: Record<string, any>;
		formatDate: (value: string) => string;
	} = $props();
</script>

<section class="section event-sec">
	<div class="section-heading">
		<h2 class="title">Wedding Day</h2>
		<p>Acara InsyaAllah akan dilaksanakan pada:</p>
	</div>

	<div class="event-cards">
		<div class="event-card reveal delay-1">
			<h3>Akad Nikah</h3>
			<div class="event-details">
				<p><strong>{formatDate(invitation.akad_date)}</strong></p>
				<p>Pukul {invitation.akad_time}</p>
			</div>
		</div>

		<div class="event-card reveal delay-2">
			<h3>Resepsi Pernikahan</h3>
			<div class="event-details">
				<p><strong>{formatDate(invitation.resepsi_date)}</strong></p>
				<p>Pukul {invitation.resepsi_time}</p>
			</div>
		</div>
	</div>

	<div class="venue-info reveal">
		<h4>Bertempat di:</h4>
		<p class="venue-name"><strong>{invitation.venue_name}</strong></p>
		<p class="venue-address" style="margin-bottom: 1.5rem;">{invitation.venue_address}</p>
		
		{#if invitation.venue_name}
			<div class="map-preview reveal zoom-in delay-1" style="margin-bottom: 1.5rem; border-radius: 15px; overflow: hidden; border: 1px solid rgba(0,0,0,0.1); box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
				<iframe
					title="Lokasi Acara"
					width="100%"
					height="200"
					frameborder="0"
					style="border:0;"
					src="https://maps.google.com/maps?q={encodeURIComponent(invitation.venue_name + ' ' + (invitation.venue_address || ''))}&t=&z=15&ie=UTF8&iwloc=&output=embed"
					allowfullscreen
				></iframe>
			</div>
		{/if}

		{#if invitation.venue_map_url}
			<a
				href={invitation.venue_map_url}
				target="_blank"
				class="btn-primary"
				style="display: inline-flex; align-items: center; gap: 0.5rem;"
				>📍 Buka Google Maps</a
			>
		{/if}
	</div>
</section>

<style>
	.event-sec {
		background: transparent;
	}
	.event-cards {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}
	@media (min-width: 768px) {
		.event-cards {
			grid-template-columns: 1fr 1fr;
		}
	}
	.event-card {
		padding: 2.5rem 2rem;
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(12px);
		border-radius: 20px;
		border: 1px solid rgba(255, 255, 255, 0.6);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
	}
	.event-card h3 {
		color: var(--p-col);
		margin-bottom: 1.5rem;
		font-family: var(--f-fam);
		font-size: 1.8rem;
		border-bottom: 2px solid var(--a-col);
		padding-bottom: 0.5rem;
		display: inline-block;
	}
	.event-details p {
		margin-bottom: 0.5rem;
		font-size: 1.05rem;
	}
	.venue-info {
		padding: 3rem 2rem;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(12px);
		border-radius: 20px;
		border: 1px solid rgba(255, 255, 255, 0.8);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
	}
	.venue-name {
		font-size: 1.4rem;
		color: var(--p-col);
		margin: 1rem 0 0.5rem;
		font-weight: 600;
	}

	:global(.template-royal-midnight .event-cards) {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 25px;
	}
	:global(.template-royal-midnight .event-card) {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(192, 160, 128, 0.2);
		border-radius: 20px;
		padding: 2.5rem;
	}
	:global(.template-royal-midnight .event-card h3) {
		color: var(--s-col);
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	:global(.template-luxury-emerald .venue-info) {
		border: 2px double var(--s-col);
		background: white;
		position: relative;
	}

	@media (max-width: 600px) {
		.event-cards {
			grid-template-columns: 1fr;
		}
	}
</style>
