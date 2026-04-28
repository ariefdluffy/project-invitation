<script lang="ts">
	let { images }: { images: string[] } = $props();
</script>

<section class="section gallery-sec">
	<div class="section-heading">
		<h2 class="title">Our Moments</h2>
		<p>Sebuah kebahagiaan bagi kami untuk membagikan momen-momen indah ini.</p>
	</div>
	<div class="gallery-grid">
		{#each images as img}
			<div class="gallery-item reveal zoom-in" style="background-image: url('{img}');"></div>
		{/each}
	</div>
</section>

<style>
	.gallery-sec {
		background: transparent;
	}
	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}
	@media (min-width: 600px) {
		.gallery-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.5rem;
		}
	}
	.gallery-item {
		width: 100%;
		aspect-ratio: 1 / 1;
		background-size: cover;
		background-position: center;
		border-radius: 16px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
		border: 3px solid rgba(255, 255, 255, 0.9);
		transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}
	.gallery-item:hover {
		transform: scale(1.05) rotate(1deg);
		z-index: 2;
	}
</style>
