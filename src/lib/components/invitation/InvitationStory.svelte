<script lang="ts">
	let { loveStory }: { loveStory: string } = $props();
</script>

<section class="section story-sec reveal">
	<div class="section-heading">
		<h2 class="title">Our Story</h2>
		<p>Every love story in this universe is beautiful, but ours is my favorite.</p>
	</div>
	<div class="story-content">
		{#each loveStory.split("\n\n") as paragraph}
			<p>{paragraph}</p>
		{/each}
	</div>
</section>

<style>
	.story-content {
		text-align: left;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(10px);
		padding: 2rem;
		border-radius: 16px;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
	}
	.story-content p {
		margin-bottom: 1rem;
		line-height: 1.8;
		font-size: 0.95rem;
	}
</style>
