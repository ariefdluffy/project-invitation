<script lang="ts">
	import '../app.css';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	import { toast } from '$lib/toast.svelte';
	let { data, children } = $props();
	let lastFlashId = $state<string | null>(null);

	$effect(() => {
		const flash = data?.flash;
		if (flash?.message) {
			const flashKey = flash.id || `${flash.type || 'info'}:${flash.message}`;
			if (lastFlashId === flashKey) return;
			const type = flash.type === 'success' || flash.type === 'error' || flash.type === 'info'
				? flash.type
				: 'info';
			toast[type](flash.message);
			lastFlashId = flashKey;
		}
	});
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#1a1a2e" />
</svelte:head>

{@render children()}
<ToastContainer />
