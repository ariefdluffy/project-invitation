<script lang="ts">
	let {
		accounts,
		copyToClipboard
	}: {
		accounts: Array<{ bank: string; number: string; name: string }>;
		copyToClipboard: (value: string) => void | Promise<void>;
	} = $props();
</script>

<section class="section gift-sec reveal">
	<div class="section-heading">
		<h2 class="title">Wedding Gift</h2>
		<p>
			Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda
			kasih Anda, Anda dapat memberi kado secara cashless.
		</p>
	</div>

	<div class="bank-cards">
		{#each accounts as acc}
			<div class="bank-card reveal">
				<h4>Bank {acc.bank}</h4>
				<p class="acc-num">{acc.number}</p>
				<p class="acc-name">a.n {acc.name}</p>
				<button class="btn-copy" onclick={() => copyToClipboard(acc.number)}>📋 Copy Rekening</button>
			</div>
		{/each}
	</div>
</section>

<style>
	.gift-sec {
		background: transparent;
	}
	.bank-cards {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}
	@media (min-width: 600px) {
		.bank-cards {
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		}
	}
	.bank-card {
		padding: 2rem 1.5rem;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(12px);
		border-radius: 16px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.6);
	}
	.bank-card h4 {
		color: var(--p-col);
		margin-bottom: 1rem;
		font-size: 1.2rem;
	}
	.acc-num {
		font-size: 1.6rem;
		font-weight: 700;
		letter-spacing: 2px;
		margin-bottom: 0.5rem;
		color: #222;
	}
	.btn-copy {
		margin-top: 1.5rem;
		background: white;
		border: 1px solid var(--s-col);
		padding: 0.6rem 1.5rem;
		border-radius: 50px;
		color: var(--p-col);
		cursor: pointer;
		font-weight: 600;
		transition: all 0.2s;
	}
	.btn-copy:hover {
		background: var(--p-col);
		color: white;
	}
</style>
