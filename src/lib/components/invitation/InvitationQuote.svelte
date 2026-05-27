<script lang="ts">
	let { quote, quoteSource }: { quote: string; quoteSource: string } = $props();
</script>

<section class="section quote-sec reveal">
	<svg
		class="quote-icon"
		viewBox="0 0 24 24"
		fill="var(--p-col)"
		><path
			d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
		/></svg
	>
	<p class="quote-text">"{quote}"</p>
	<p class="quote-source">- {quoteSource} -</p>
</section>

<style>
	.quote-sec {
		background: transparent;
	}
	.quote-icon {
		width: 40px;
		height: 40px;
		margin-bottom: 1rem;
		opacity: 0.5;
	}
	.quote-text {
		font-size: 1.1rem;
		font-style: italic;
		line-height: 1.8;
		margin-bottom: 1rem;
	}
	.quote-source {
		font-weight: 600;
		color: var(--p-col);
	}
</style>
