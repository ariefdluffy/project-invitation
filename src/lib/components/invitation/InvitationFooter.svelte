<script lang="ts">
	let { invitation }: { invitation: Record<string, any> } = $props();
</script>

<footer class="invitation-footer">
	<div class="footer-static-text" style="max-width: 80%; margin: 0 auto 3rem; font-style: italic; opacity: 0.9; line-height: 1.6;">
		"Merupakan Suatu Kebahagiaan dan Kehormatan bagi Kami, Apabila Bapak/Ibu/Saudara/i, Berkenan Hadir di Acara kami"
	</div>

	<div class="hormat-kami" style="margin-bottom: 3rem;">
		<p style="font-size: 0.9rem; margin-bottom: 0.8rem; opacity: 0.8;">Hormat Kami,</p>
		<h3 style="font-family: var(--f-fam); font-size: 1.3rem; color: white; line-height: 1.6;">
			{#if invitation.respect_person}
				{#each invitation.respect_person.split('\n') as line}
					<div style="margin-bottom: 0.25rem;">{line}</div>
				{/each}
			{:else}
				{invitation.bride_parents} & {invitation.groom_parents}
			{/if}
		</h3>
	</div>

	<h2 class="names" style="font-size: 2.5rem; margin-bottom: 1rem;">
		{invitation.bride_name} & {invitation.groom_name}
	</h2>
	<p>Terima Kasih</p>
	<p style="font-size: 0.8rem; margin-top: 2rem; opacity: 0.8;">
		Created with <a
			href="https://instagram.com/miftahularifhidayah"
			target="_blank"
			style="color: inherit; text-decoration: underline; font-weight: 600;"
			>Love</a
		>
	</p>
</footer>

<style>
	.invitation-footer {
		position: relative;
		z-index: 1;
		padding: 4rem 2rem;
		text-align: center;
		background: linear-gradient(135deg, var(--p-col), var(--s-col));
		color: white;
	}
	.invitation-footer .names {
		color: white;
	}
</style>
