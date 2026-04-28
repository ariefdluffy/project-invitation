<script lang="ts">
	import '../app.css';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#1a1a2e" />
	<link rel="icon" type="image/png" href="/favicon.png" />
</svelte:head>

{@render children()}
<ToastContainer />
