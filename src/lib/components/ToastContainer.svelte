<script lang="ts">
	import { toast } from '$lib/toast.svelte';
	import { slide, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
</script>

<div class="toast-container">
	{#each toast.toasts as t (t.id)}
		<div
			class="toast-card {t.type}"
			transition:fade={{ duration: 150 }}
		>
			<div class="toast-icon">
				{#if t.type === 'success'}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
				{:else if t.type === 'error'}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
				{:else}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
				{/if}
			</div>
			<div class="toast-message">{t.message}</div>
			<button class="toast-close" onclick={() => toast.remove(t.id)}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
			</button>
		</div>
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		bottom: 24px;
		right: 24px;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: 12px;
		pointer-events: none;
	}

	.toast-card {
		pointer-events: auto;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 20px;
		background: #fff;
		border-radius: 12px;
		box-shadow: 0 10px 40px -10px rgba(0,0,0,0.15);
		border-left: 5px solid;
		min-width: 300px;
		max-width: 400px;
		position: relative;
		overflow: hidden;
	}

	.toast-card.success {
		border-left-color: #2ecc71;
	}
	.toast-card.success .toast-icon {
		color: #2ecc71;
	}

	.toast-card.error {
		border-left-color: #e74c3c;
	}
	.toast-card.error .toast-icon {
		color: #e74c3c;
	}

	.toast-card.info {
		border-left-color: #3498db;
	}
	.toast-card.info .toast-icon {
		color: #3498db;
	}

	.toast-icon {
		display: flex;
		flex-shrink: 0;
	}
	.toast-icon svg {
		width: 20px;
		height: 20px;
	}

	.toast-message {
		flex: 1;
		font-size: 0.95rem;
		color: #333;
		font-family: var(--font-sans, system-ui, sans-serif);
		line-height: 1.4;
	}

	.toast-close {
		background: none;
		border: none;
		color: #aaa;
		cursor: pointer;
		display: flex;
		padding: 4px;
		border-radius: 4px;
		transition: all 0.2s;
	}
	.toast-close:hover {
		background: #f5f5f5;
		color: #333;
	}
	.toast-close svg {
		width: 16px;
		height: 16px;
	}
</style>
