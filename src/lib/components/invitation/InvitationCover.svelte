<script lang="ts">
	let {
		invitation,
		templateTitle,
		isOpened,
		randomBg,
		openInvitation,
		guestName = ""
	}: {
		invitation: Record<string, any>;
		templateTitle: string;
		isOpened: boolean;
		randomBg: string;
		openInvitation: () => void;
		guestName?: string;
	} = $props();
</script>

<div
	class="cover-section"
	class:open={isOpened}
	style={randomBg
		? `background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${randomBg}') center/cover no-repeat;`
		: ""}
>
	<div class="cover-content">
		<div class="cover-subtitle">{templateTitle}</div>
		<h1 class="cover-title">
			{invitation.bride_name} <br />&<br />
			{invitation.groom_name}
		</h1>
		<div class="cover-date">
			{invitation.akad_date
				? new Date(invitation.akad_date)
						.toLocaleDateString("id-ID", {
							day: "2-digit",
							month: "2-digit",
							year: "numeric",
						})
						.replace(/\//g, " . ")
				: ""}
		</div>

		<div class="guest-info">
			<p>Kepada Yth. Bapak/Ibu/Saudara/i</p>
			<h3>{guestName || "Tamu Undangan"}</h3>
		</div>

		<button class="btn-open" onclick={openInvitation}>
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				><path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5" /><path
					d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 002-2v-6l-3.5-6.9A2 2 0 0017 4H7a2 2 0 00-1.5 1.1z"
				/></svg
			>
			Buka Undangan
		</button>
	</div>
</div>

<style>
	.cover-section {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, var(--p-col), var(--s-col));
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 1s cubic-bezier(0.77, 0, 0.175, 1);
	}
	.cover-section.open {
		transform: translateY(-100%);
	}
	.cover-content {
		text-align: center;
		background: rgba(255, 255, 255, 0.95);
		padding: 3rem 2rem;
		border-radius: 20px;
		width: 90%;
		max-width: 400px;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
		position: relative;
		overflow: hidden;
	}
	.cover-content::before {
		content: "";
		position: absolute;
		inset: 10px;
		border: 1px solid var(--s-col);
		border-radius: 12px;
		pointer-events: none;
	}
	.cover-subtitle {
		font-size: 0.8rem;
		letter-spacing: 4px;
		color: var(--s-col);
		margin-bottom: 1rem;
	}
	.guest-info {
		margin: 1.5rem 0;
		text-align: center;
	}
	.guest-info p {
		font-size: 0.9rem;
		color: var(--s-col);
		margin: 0 0 0.5rem 0;
		letter-spacing: 0.5px;
	}
	.guest-info h3 {
		font-size: 1.3rem;
		margin: 0;
		color: var(--p-col);
		font-weight: 600;
	}
	.cover-title {
		font-size: 2.8rem;
		line-height: 1.1;
		margin-bottom: 1.5rem;
	}
	.cover-date {
		font-size: 0.9rem;
		letter-spacing: 2px;
		color: var(--p-col);
		margin-bottom: 2rem;
	}
	.btn-open {
		background: var(--color-primary);
		color: white;
		padding: 1rem 2.5rem;
		border-radius: 50px;
		font-size: 1.1rem;
		font-weight: 700;
		display: inline-flex;
		align-items: center;
		gap: 0.8rem;
		border: 2px solid #ffffff;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
		cursor: pointer;
		transition: transform 0.3s;
	}
	.btn-open:hover {
		transform: scale(1.1);
		background: var(--color-secondary);
	}
</style>
