<script lang="ts">
	import type { PageData, ActionData } from "./$types";
	import KhitanLayout from "$lib/components/invitations/KhitanLayout.svelte";
	import AqiqahLayout from "$lib/components/invitations/AqiqahLayout.svelte";
	import BirthdayLayout from "$lib/components/invitations/BirthdayLayout.svelte";
	import GatheringLayout from "$lib/components/invitations/GatheringLayout.svelte";
	import FormalLayout from "$lib/components/invitations/FormalLayout.svelte";
	import GeneralLayout from "$lib/components/invitations/GeneralLayout.svelte";
	import ThreeDMotionWedding from "$lib/components/invitations/ThreeDMotionWedding.svelte";
	import Tema31InspiredWedding from "$lib/components/invitations/Tema31InspiredWedding.svelte";
	import InvitationCover from "$lib/components/invitation/InvitationCover.svelte";
	import InvitationHero from "$lib/components/invitation/InvitationHero.svelte";
	import InvitationQuote from "$lib/components/invitation/InvitationQuote.svelte";
	import InvitationCouple from "$lib/components/invitation/InvitationCouple.svelte";
	import InvitationEvent from "$lib/components/invitation/InvitationEvent.svelte";
	import InvitationStory from "$lib/components/invitation/InvitationStory.svelte";
	import InvitationGallery from "$lib/components/invitation/InvitationGallery.svelte";
	import InvitationGift from "$lib/components/invitation/InvitationGift.svelte";
	import InvitationDress from "$lib/components/invitation/InvitationDress.svelte";
	import InvitationRsvp from "$lib/components/invitation/InvitationRsvp.svelte";
	import InvitationFooter from "$lib/components/invitation/InvitationFooter.svelte";
	import InvitationSharedStyles from "$lib/components/invitation/InvitationSharedStyles.svelte";
	import InvitationLayoutStyles from "$lib/components/invitation/InvitationLayoutStyles.svelte";
	import { toast } from "$lib/toast.svelte";

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const invitation = $derived(data.invitation || {});
	const template = $derived(data.template || {});
	const wishes = $derived(data.wishes || []);
	const guestName = $derived(data.guestName || "");
	const category = $derived((template?.category || "wedding").toLowerCase());
	const isThreeDMotion = $derived(template?.id === "tmpl-3d-motion-wedding");
	const isTema31 = $derived(template?.id === "tmpl-tema-31-inspired");
	const isWedding = $derived(
		category === "wedding" || category === "pernikahan" || category === "anniversary"
	);

	let isOpened = $state(false);
	let randomBg = $state("");

	$effect(() => {
		if (invitation.background_image) {
			const urls = invitation.background_image
				.split(/[\n,]+/)
				.map((u) => u.trim())
				.filter(Boolean);
			if (urls.length > 0) {
				const randomIndex = Math.floor(Math.random() * urls.length);
				randomBg = urls[randomIndex];
			}
		}
	});

	// Audio handling
	let isPlaying = $state(true);
	let audioRef = $state<HTMLAudioElement | null>(null);

	function toggleAudio() {
		if (!audioRef) return;
		if (isPlaying) {
			audioRef.pause();
		} else {
			audioRef.play();
		}
		isPlaying = !isPlaying;
	}

	function fadeInAudio() {
		if (!audioRef) {
			console.log("AudioRef not ready, retrying in 100ms...");
			setTimeout(fadeInAudio, 100);
			return;
		}

		audioRef.volume = 0;
		const playPromise = audioRef.play();

		if (playPromise !== undefined) {
			playPromise
				.then(() => {
					console.log("Audio started playing successfully");
					let vol = 0;
					const interval = setInterval(() => {
						if (vol < 1) {
							vol += 0.05;
							if (audioRef) audioRef.volume = Math.min(vol, 1);
						} else {
							clearInterval(interval);
						}
					}, 100);
				})
				.catch((error) => {
					console.error("Playback failed:", error);
					isPlaying = false;
				});
		}
	}

	function openInvitation() {
		isOpened = true;
		isPlaying = true;
		fadeInAudio();
		document.body.style.overflow = "auto";
	}

	// Prevent scrolling when cover is open
	$effect(() => {
		if (!isOpened) {
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	});

	// Parse JSON fields
	const bankAccounts = $derived(JSON.parse(invitation.bank_accounts || "[]"));
	const dressColors = $derived(JSON.parse(invitation.dress_code_colors || "[]"));
	const galleryImages = $derived(
		(invitation.gallery_images || "")
			.split(/[\n,]+/)
			.map((u) => u.trim())
			.filter(Boolean)
	);

	let customContent = $derived.by(() => {
		const raw = invitation.custom_content;
		if (typeof raw === "object" && raw !== null) return raw;
		try {
			return JSON.parse(raw || "{}");
		} catch (e) {
			return {};
		}
	});

	const templateTitle = $derived(
		customContent.title || template?.defaultContent?.title || "THE WEDDING OF"
	);

	function formatDate(dateStr: string) {
		if (!dateStr) return "";
		return new Date(dateStr).toLocaleDateString("id-ID", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric"
		});
	}

	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			toast.success("Berhasil disalin: " + text);
		} catch (err) {
			console.error("Failed to copy: ", err);
			toast.error("Gagal menyalin");
		}
	}

	const cssVars = $derived(`
		--p-col: ${template.primary_color};
		--s-col: ${template.secondary_color};
		--a-col: ${template.accent_color};
		--f-fam: '${template.font_family}', serif;
	`);

	let timeLeft = $state({ d: 0, h: 0, m: 0, s: 0 });

	$effect(() => {
		if (!invitation.akad_date) return;

		const d = new Date(invitation.akad_date);
		if (isNaN(d.getTime())) return;

		const [hh, mm] = (invitation.akad_time || "00:00").split(":");

		const targetDate = new Date(
			d.getFullYear(),
			d.getMonth(),
			d.getDate(),
			parseInt(hh || "0"),
			parseInt(mm || "0"),
			0
		).getTime();

		const interval = setInterval(() => {
			const now = new Date().getTime();
			const distance = targetDate - now;

			if (distance < 0) {
				clearInterval(interval);
				timeLeft = { d: 0, h: 0, m: 0, s: 0 };
				return;
			}

			timeLeft = {
				d: Math.floor(distance / (1000 * 60 * 60 * 24)),
				h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
				m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
				s: Math.floor((distance % (1000 * 60)) / 1000)
			};
		}, 1000);

		return () => clearInterval(interval);
	});

	$effect(() => {
		if (isOpened) {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							entry.target.classList.add("reveal-visible");
						}
					});
				},
				{ threshold: 0.1 }
			);

			const elements = document.querySelectorAll(".reveal");
			elements.forEach((el) => observer.observe(el));

			return () => observer.disconnect();
		}
	});
</script>

<svelte:head>
	<title>{templateTitle} {invitation.bride_name} & {invitation.groom_name}</title>
	<meta
		name="description"
		content="Undangan {templateTitle} {invitation.bride_name} & {invitation.groom_name}"
	/>
	<style>
		@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&display=swap");
	</style>
	<style>
		body {
			background-color: var(--a-col) !important;
		}
	</style>
</svelte:head>

<div
	class="invitation-container template-{template.id} layout-{template.layout_style}"
	style="{cssVars} {randomBg
		? `background: url('${randomBg}') center/cover fixed no-repeat;`
		: ''}"
>
	{#if template.background_type === "3d"}
		
	{:else}
		<div class="bg-blur-overlay"></div>

		{#if invitation.music_url}
			<audio
				bind:this={audioRef}
				loop
				preload="auto"
				src={invitation.music_url}
				onerror={() => console.error("Gagal memuat musik:", invitation.music_url)}
			></audio>
		{/if}

		{#if isOpened}
			<button class="audio-btn" onclick={toggleAudio} aria-label="Toggle Music">
				{#if isPlaying}
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg
					>
				{:else}
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg
					>
				{/if}
			</button>
		{/if}

		{#if isTema31}
			<Tema31InspiredWedding {invitation} {template} {wishes} {guestName} {form} />
		{:else if isThreeDMotion}
			<ThreeDMotionWedding {invitation} {template} {wishes} {guestName} {form} />
		{:else if !isWedding}
			{#if category === "khitan"}
				<KhitanLayout {invitation} {template} {wishes} {guestName} {form} />
			{:else if category === "aqiqah"}
				<AqiqahLayout {invitation} {template} {wishes} {guestName} {form} />
			{:else if category === "birthday"}
				<BirthdayLayout {invitation} {template} {wishes} {guestName} {form} />
			{:else if category === "gathering"}
				<GatheringLayout {invitation} {template} {wishes} {guestName} {form} />
			{:else if category === "formal" || category === "corporate"}
				<FormalLayout {invitation} {template} {wishes} {guestName} {form} />
			{:else}
				<GeneralLayout {invitation} {template} {wishes} {guestName} {form} />
			{/if}
		{:else}
			<InvitationCover {invitation} {templateTitle} {isOpened} {randomBg} {openInvitation} />

			{#if isOpened}
				<main class="invitation-main animate-fade-in">
					<InvitationHero {invitation} {templateTitle} {timeLeft} />
					{#if invitation.quote}
						<InvitationQuote quote={invitation.quote} quoteSource={invitation.quote_source} />
					{/if}
					<InvitationCouple {invitation} {customContent} />
					<InvitationEvent {invitation} {formatDate} />
					{#if invitation.love_story}
						<InvitationStory loveStory={invitation.love_story} />
					{/if}
					{#if galleryImages.length > 0}
						<InvitationGallery images={galleryImages} />
					{/if}
					{#if bankAccounts.length > 0}
						<InvitationGift accounts={bankAccounts} {copyToClipboard} />
					{/if}
					{#if dressColors.length > 0}
						<InvitationDress colors={dressColors} />
					{/if}
					<InvitationRsvp {form} {wishes} {guestName} />
					<InvitationFooter {invitation} />
				</main>
			{/if}
		{/if}
	{/if}
</div>

<InvitationSharedStyles />
<InvitationLayoutStyles />
