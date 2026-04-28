<script lang="ts">
  import type { PageData } from "./$types";
  import { toast } from "$lib/toast.svelte";
  import KhitanLayout from "$lib/components/invitations/KhitanLayout.svelte";
  import AqiqahLayout from "$lib/components/invitations/AqiqahLayout.svelte";
  import BirthdayLayout from "$lib/components/invitations/BirthdayLayout.svelte";
  import GatheringLayout from "$lib/components/invitations/GatheringLayout.svelte";
  import FormalLayout from "$lib/components/invitations/FormalLayout.svelte";
  import GeneralLayout from "$lib/components/invitations/GeneralLayout.svelte";
  import ThreeDMotionWedding from "$lib/components/invitations/ThreeDMotionWedding.svelte";
  import Tema31InspiredWedding from "$lib/components/invitations/Tema31InspiredWedding.svelte";

  let { data }: { data: PageData } = $props();

  const invitation = $derived(data.invitation);
  const template = $derived(data.template);
  const wishes = $derived(data.wishes);
  const guestName = $derived(data.guestName);
  const templateTitle = $derived(
    template?.defaultContent?.title || "THE WEDDING OF",
  );
  const category = $derived((template?.category || "wedding").toLowerCase());
  const isThreeDMotion = $derived(template?.id === "tmpl-3d-motion-wedding");
  const isTema31 = $derived(template?.id === "tmpl-tema-31-inspired");
  const isWedding = $derived(
    category === "wedding" ||
      category === "pernikahan" ||
      category === "anniversary",
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
  let isPlaying = $state(false);
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

  function openInvitation() {
    isOpened = true;
    if (audioRef) {
      audioRef.play().catch((e) => console.log("Audio autoplay prevented"));
      isPlaying = true;
    }
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
  const dressColors = $derived(
    JSON.parse(invitation.dress_code_colors || "[]"),
  );
  const galleryImages = $derived(
    (invitation.gallery_images || "")
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter(Boolean),
  );

  function formatDate(dateStr: string) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Berhasil disalin: " + text);
    } catch (err) {
      toast.error("Gagal menyalin");
    }
  }

  const cssVars = $derived(`
		--p-col: ${template.primary_color};
		--s-col: ${template.secondary_color};
		--a-col: ${template.accent_color};
		--f-fam: '${template.font_family}', serif;
	`);
</script>

<svelte:head>
  <title>Preview Template: {template.name}</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&family=Cinzel:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Special+Elite&family=Cinzel+Decorative:wght@400;700&family=Outfit:wght@300;400;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Alex+Brush&display=swap");

    body {
      background-color: var(--a-col) !important;
    }
  </style>
</svelte:head>

<div class="preview-mode-badge">PREVIEW MODE: {template.name}</div>
<a href="/admin/templates" class="back-to-admin">← Kembali ke Admin</a>

{#if isTema31}
  <Tema31InspiredWedding {invitation} {template} {wishes} {guestName} />
{:else if isThreeDMotion}
  <ThreeDMotionWedding {invitation} {template} {wishes} {guestName} />
{:else if !isWedding}
  {#if category === "khitan"}
    <KhitanLayout {invitation} {template} {wishes} {guestName} />
  {:else if category === "aqiqah"}
    <AqiqahLayout {invitation} {template} {wishes} {guestName} />
  {:else if category === "birthday"}
    <BirthdayLayout {invitation} {template} {wishes} {guestName} />
  {:else if category === "gathering"}
    <GatheringLayout {invitation} {template} {wishes} {guestName} />
  {:else if category === "formal" || category === "corporate"}
    <FormalLayout {invitation} {template} {wishes} {guestName} />
  {:else}
    <GeneralLayout {invitation} {template} {wishes} {guestName} />
  {/if}
{:else}
  <div
    class="invitation-container"
    style="{cssVars} {randomBg
      ? `background: url('${randomBg}') center/cover fixed no-repeat;`
      : ''}"
  >
    <div class="bg-blur-overlay"></div>

    {#if invitation.music_url}
      <audio bind:this={audioRef} loop src={invitation.music_url}></audio>
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
            ><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path
              d="M15.54 8.46a5 5 0 0 1 0 7.07"
            ></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg
          >
        {:else}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            ><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line
              x1="23"
              y1="9"
              x2="17"
              y2="15"
            ></line><line x1="17" y1="9" x2="23" y2="15"></line></svg
          >
        {/if}
      </button>
    {/if}

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
        <div class="cover-date">{formatDate(invitation.akad_date)}</div>

        <div class="guest-info">
          <p>Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <h3>{guestName}</h3>
        </div>

        <button class="btn-open" onclick={openInvitation}>
          Buka Undangan
        </button>
      </div>
    </div>

    {#if isOpened}
      <main class="invitation-main animate-fade-in">
        <section class="section hero-sec">
          <div class="hero-box">
            <p class="subtitle">{templateTitle}</p>
            <h2 class="names">
              {invitation.bride_name} & {invitation.groom_name}
            </h2>
            <p class="date">{formatDate(invitation.akad_date)}</p>
          </div>
        </section>

        <section class="section couple-sec">
          <div class="section-heading">
            <h2 class="title">Bride & Groom</h2>
            <p>Mempelai yang berbahagia:</p>
          </div>

          <div class="couple-card">
            <div
              class="avatar"
              style="background-image: url({invitation.bride_photo})"
            ></div>
            <h3 class="name">{invitation.bride_name}</h3>
            <p class="full-name">{invitation.bride_full_name}</p>
            <p class="parents">{invitation.bride_parents}</p>
          </div>

          <div class="and-symbol">&</div>

          <div class="couple-card">
            <div
              class="avatar"
              style="background-image: url({invitation.groom_photo})"
            ></div>
            <h3 class="name">{invitation.groom_name}</h3>
            <p class="full-name">{invitation.groom_full_name}</p>
            <p class="parents">{invitation.groom_parents}</p>
          </div>
        </section>

        <section class="section event-sec">
          <div class="section-heading">
            <h2 class="title">Wedding Day</h2>
          </div>
          <div class="event-card">
            <h3>Akad Nikah</h3>
            <p>{formatDate(invitation.akad_date)}</p>
            <p>{invitation.akad_time}</p>
          </div>
          <div class="event-card" style="margin-top: 1rem;">
            <h3>Resepsi</h3>
            <p>{formatDate(invitation.resepsi_date)}</p>
            <p>{invitation.resepsi_time}</p>
          </div>
          <div class="venue-info" style="margin-top: 1rem;">
            <h4>Lokasi:</h4>
            <p><strong>{invitation.venue_name}</strong></p>
            <p>{invitation.venue_address}</p>
          </div>
        </section>

        {#if galleryImages.length > 0}
          <section class="section gallery-sec">
            <h2 class="title">Gallery</h2>
            <div class="gallery-grid">
              {#each galleryImages as img}
                <div
                  class="gallery-item"
                  style="background-image: url('{img}');"
                ></div>
              {/each}
            </div>
          </section>
        {/if}

        <footer class="invitation-footer">
          <h2 class="names">
            {invitation.bride_name} & {invitation.groom_name}
          </h2>
          <p>Terima Kasih</p>
        </footer>
      </main>
    {/if}
  </div>
{/if}

<style>
  .preview-mode-badge {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: #ef4444;
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    z-index: 2000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
  .back-to-admin {
    position: fixed;
    top: 10px;
    left: 10px;
    background: white;
    color: #333;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    z-index: 2000;
    text-decoration: none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  /* Royal Midnight - Modernized */
  :global(.template-royal-midnight) .hero-box {
    background: linear-gradient(
      135deg,
      rgba(15, 23, 42, 0.9),
      rgba(0, 0, 0, 0.8)
    );
    backdrop-filter: blur(15px);
    border: 1px solid rgba(192, 160, 128, 0.3);
    border-radius: 30px;
    padding: 3rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  }
  :global(.template-royal-midnight) .couple-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(192, 160, 128, 0.2);
    border-radius: 25px;
    padding: 2rem;
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  :global(.template-royal-midnight) .couple-card:hover {
    transform: translateY(-15px);
  }
  .template-royal-midnight .avatar {
    border: 4px solid var(--s-col);
    box-shadow: 0 0 20px rgba(192, 160, 128, 0.5);
  }
  .template-royal-midnight .event-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
  }
  .template-royal-midnight .event-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(192, 160, 128, 0.2);
    border-radius: 20px;
    padding: 2.5rem;
  }
  .template-royal-midnight .event-card h3 {
    color: var(--s-col);
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  /* End Modernization */
  .bg-blur-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(6px);
    z-index: 0;
  }
  .title,
  .names,
  .cover-title {
    font-family: var(--f-fam);
    color: var(--p-col);
  }
  .audio-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100;
    background: var(--p-col);
    color: white;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
  }
  .cover-section {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.8s ease-in-out;
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
  }
  .cover-title {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }
  .btn-open {
    background: var(--p-col);
    color: white;
    padding: 0.8rem 2rem;
    border-radius: 50px;
    border: none;
    cursor: pointer;
  }
  .section {
    padding: 4rem 1.5rem;
    text-align: center;
    position: relative;
    z-index: 1;
  }
  .hero-sec {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hero-box {
    padding: 3rem 2rem;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 20px;
  }
  .couple-card {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    margin-bottom: 2rem;
  }
  .avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin: 0 auto 1rem;
    background-size: cover;
    background-position: center;
    border: 4px solid white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  .and-symbol {
    font-size: 3rem;
    color: var(--s-col);
    font-family: var(--f-fam);
  }
  .event-card {
    background: white;
    padding: 2rem;
    border-radius: 20px;
  }
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 1rem;
  }
  .gallery-item {
    aspect-ratio: 1;
    background-size: cover;
    background-position: center;
    border-radius: 12px;
  }
  .invitation-footer {
    padding: 4rem 2rem;
    background: rgba(255, 255, 255, 0.5);
  }
</style>
