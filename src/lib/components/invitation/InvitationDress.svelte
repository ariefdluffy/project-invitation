<script lang="ts">
	let { colors }: { colors: string[] } = $props();
</script>

<section class="section dress-sec reveal">
	<div class="section-heading">
		<h2 class="title">Dress Code</h2>
		<p>
			Kami mengajak Bapak/Ibu/Saudara/i untuk menggunakan pakaian dengan palet warna berikut di hari istimewa kami.
		</p>
	</div>
	<div class="color-palette">
		{#each colors as color}
			<div class="color-circle" style="background-color: {color};"></div>
		{/each}
	</div>
</section>

<style>
	.color-palette {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		margin-top: 2rem;
	}
	.color-circle {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
		border: 3px solid white;
	}
</style>
