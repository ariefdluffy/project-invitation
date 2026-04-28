<script lang="ts">
  import { enhance } from "$app/forms";
  import { toast } from "$lib/toast.svelte";

  type LayoutConfig = {
    titleFallback: string;
    nameMode: "single" | "pair" | "child-parent";
    primaryNameKey: string;
    secondaryNameKey?: string;
    aboutTitle: string;
    aboutFallback: string;
    eventTitle: string;
    primaryEventLabel: string;
    secondaryEventLabel: string;
    footerThanks: string;
  };

  const defaultLayout: LayoutConfig = {
    titleFallback: "Undangan",
    nameMode: "single",
    primaryNameKey: "groom_name",
    secondaryNameKey: "bride_name",
    aboutTitle: "Tentang Acara",
    aboutFallback:
      "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara ini.",
    eventTitle: "Detail Acara",
    primaryEventLabel: "Acara Utama",
    secondaryEventLabel: "Sesi Lanjutan",
    footerThanks: "Terima Kasih",
  };

  let {
    invitation,
    template,
    wishes = [],
    guestName = "",
    form,
    layout = defaultLayout,
  } = $props();

  let isOpened = $state(false);
  let randomBg = $state("");
  let isPlaying = $state(false);
  let audioRef = $state<HTMLAudioElement | null>(null);

  const customContent = $derived.by(() => {
    const raw = invitation?.custom_content;
    if (typeof raw === "object" && raw !== null)
      return raw as Record<string, any>;
    try {
      return JSON.parse(raw || "{}");
    } catch {
      return {} as Record<string, any>;
    }
  });

  const templateTitle = $derived(
    customContent?.title ||
      template?.defaultContent?.title ||
      layout.titleFallback,
  );

  const primaryName = $derived.by(
    () =>
      invitation?.[layout.primaryNameKey] ||
      invitation?.groom_name ||
      invitation?.bride_name ||
      "",
  );

  const secondaryName = $derived.by(() => {
    if (!layout.secondaryNameKey) return "";
    return invitation?.[layout.secondaryNameKey] || "";
  });

  const showSecondaryName = $derived.by(
    () => layout.nameMode !== "single" && Boolean(secondaryName),
  );

  const aboutText = $derived.by(
    () => invitation?.love_story || invitation?.quote || layout.aboutFallback,
  );

  const bankAccounts = $derived.by(() =>
    JSON.parse(invitation?.bank_accounts || "[]"),
  );
  const galleryImages = $derived.by(() =>
    (invitation?.gallery_images || "")
      .split(/[\n,]+/)
      .map((u: string) => u.trim())
      .filter(Boolean),
  );

  const primaryEventDate = $derived.by(() => invitation?.akad_date || "");
  const primaryEventTime = $derived.by(() => invitation?.akad_time || "");
  const secondaryEventDate = $derived.by(() => invitation?.resepsi_date || "");
  const secondaryEventTime = $derived.by(() => invitation?.resepsi_time || "");
  const showSecondaryEvent = $derived.by(() =>
    Boolean(secondaryEventDate || secondaryEventTime),
  );

  const cssVars = $derived(`
		--p-col: ${template?.primary_color || "#0f172a"};
		--s-col: ${template?.secondary_color || "#94a3b8"};
		--a-col: ${template?.accent_color || "#f8fafc"};
		--f-fam: '${template?.font_family || "Playfair Display"}', serif;
	`);

  $effect(() => {
    if (invitation?.background_image) {
      const urls = invitation.background_image
        .split(/[\n,]+/)
        .map((u: string) => u.trim())
        .filter(Boolean);
      if (urls.length > 0) {
        const randomIndex = Math.floor(Math.random() * urls.length);
        randomBg = urls[randomIndex];
      }
    }
  });

  $effect(() => {
    if (!isOpened) {
      document.body.style.overflow = "hidden";
      return;
    }
    document.body.style.overflow = "auto";
  });

  function openInvitation() {
    isOpened = true;
    if (audioRef) {
      audioRef.play().catch(() => {
        isPlaying = false;
      });
      isPlaying = true;
    }
  }

  function toggleAudio() {
    if (!audioRef) return;
    if (isPlaying) {
      audioRef.pause();
    } else {
      audioRef.play();
    }
    isPlaying = !isPlaying;
  }

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
    } catch {
      toast.error("Gagal menyalin");
    }
  }
</script>

<svelte:head>
  <title>{templateTitle} {primaryName}</title>
  <meta name="description" content="Undangan {templateTitle} {primaryName}" />
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;500;600&display=swap");
    body {
      background-color: var(--a-col) !important;
    }
  </style>
</svelte:head>

<div
  class="event-layout"
  style="{cssVars} {randomBg
    ? `background: url('${randomBg}') center/cover fixed no-repeat;`
    : ''}"
>
  <div class="bg-overlay"></div>

  {#if invitation?.music_url}
    <audio bind:this={audioRef} loop src={invitation.music_url}></audio>
  {/if}

  {#if isOpened}
    <button class="audio-btn" onclick={toggleAudio} aria-label="Toggle Music">
      {#if isPlaying}
        <span>♪</span>
      {:else}
        <span>♫</span>
      {/if}
    </button>
  {/if}

  <div
    class="cover"
    class:open={isOpened}
    style={randomBg
      ? `background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('${randomBg}') center/cover no-repeat;`
      : ""}
  >
    <div class="cover-card">
      <div class="cover-subtitle">{templateTitle}</div>
      <h1 class="cover-title">
        {primaryName}
        {#if showSecondaryName}
          {#if layout.nameMode === "pair"}
            <br />&<br />
          {:else}
            <br />
          {/if}
          {secondaryName}
        {/if}
      </h1>
      <div class="cover-date">{formatDate(primaryEventDate)}</div>
      <div class="guest-info">
        <p>Kepada Yth. Bapak/Ibu/Saudara/i</p>
        <h3>{guestName}</h3>
      </div>
      <button class="btn-open" onclick={openInvitation}>Buka Undangan</button>
    </div>
  </div>

  {#if isOpened}
    <main class="main">
      <section class="hero">
        <p class="hero-subtitle">{templateTitle}</p>
        <h2 class="hero-title">
          {primaryName}
          {#if showSecondaryName}
            {#if layout.nameMode === "pair"}
              <br />&<br />
            {:else}
              <br />
            {/if}
            {secondaryName}
          {/if}
        </h2>
        <p class="hero-date">{formatDate(primaryEventDate)}</p>
      </section>

      {#if aboutText}
        <section class="section">
          <h3 class="section-title">{layout.aboutTitle}</h3>
          <p class="section-text">{aboutText}</p>
        </section>
      {/if}

      <section class="section">
        <h3 class="section-title">{layout.eventTitle}</h3>
        <div class="event-grid">
          <div class="event-card">
            <h4>{layout.primaryEventLabel}</h4>
            <p>{formatDate(primaryEventDate)}</p>
            <p>{primaryEventTime}</p>
          </div>
          {#if showSecondaryEvent}
            <div class="event-card">
              <h4>{layout.secondaryEventLabel}</h4>
              <p>{formatDate(secondaryEventDate)}</p>
              <p>{secondaryEventTime}</p>
            </div>
          {/if}
        </div>
        {#if invitation?.venue_name}
          <div class="venue">
            <p class="venue-title">Lokasi</p>
            <p class="venue-name">{invitation.venue_name}</p>
            <p class="venue-address">{invitation.venue_address}</p>
            {#if invitation?.venue_map_url}
              <a
                class="btn-primary"
                href={invitation.venue_map_url}
                target="_blank">Buka Google Maps</a
              >
            {/if}
          </div>
        {/if}
      </section>

      {#if galleryImages.length > 0}
        <section class="section">
          <h3 class="section-title">Galeri</h3>
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

      {#if bankAccounts.length > 0}
        <section class="section">
          <h3 class="section-title">Gift</h3>
          <div class="bank-grid">
            {#each bankAccounts as acc}
              <div class="bank-card">
                <h4>Bank {acc.bank}</h4>
                <p class="acc-num">{acc.number}</p>
                <p class="acc-name">a.n {acc.name}</p>
                <button
                  class="btn-secondary"
                  onclick={() => copyToClipboard(acc.number)}
                  >Copy Rekening</button
                >
              </div>
            {/each}
          </div>
        </section>
      {/if}

      <section class="section">
        <h3 class="section-title">RSVP & Wishes</h3>
        <div class="form-card">
          {#if form?.success}
            <div class="alert success">
              Terima kasih atas doa dan ucapannya!
            </div>
          {/if}
          {#if form?.error}
            <div class="alert error">{form.error}</div>
          {/if}
          <form method="POST" action="?/wish" use:enhance>
            <input
              name="guest_name"
              class="input"
              placeholder="Nama Anda"
              value={guestName}
              required
            />
            <select name="is_attending" class="input" required>
              <option value="hadir">Hadir</option>
              <option value="tidak_hadir">Tidak Hadir</option>
            </select>
            <textarea
              name="message"
              class="input"
              rows="4"
              placeholder="Tulis doa & ucapan"
              required
            ></textarea>
            <button type="submit" class="btn-primary full">Kirim Ucapan</button>
          </form>
        </div>

        <div class="wishes">
          <h4>{wishes.length} Ucapan</h4>
          {#each wishes as wish}
            <div class="wish-card">
              <strong>{wish.guest_name}</strong>
              <span class="wish-badge"
                >{wish.is_attending === "hadir" ? "Hadir" : "Tidak Hadir"}</span
              >
              <p>{wish.message}</p>
            </div>
          {/each}
        </div>
      </section>

      <footer class="footer">
        <p class="footer-thanks">{layout.footerThanks}</p>
        <h3 class="footer-names">
          {primaryName}
          {#if showSecondaryName}
            {#if layout.nameMode === "pair"}
              &
            {:else}
              <br />
            {/if}
            {secondaryName}
          {/if}
        </h3>
      </footer>
    </main>
  {/if}
</div>

<style>
  .event-layout {
    min-height: 100vh;
    font-family: "Montserrat", sans-serif;
    color: #1f2937;
    position: relative;
  }
  .bg-overlay {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(6px);
    z-index: 0;
  }
  .cover {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    background: linear-gradient(135deg, var(--p-col), var(--s-col));
    transition: transform 0.8s ease;
  }
  .cover.open {
    transform: translateY(-100%);
  }
  .cover-card {
    text-align: center;
    background: rgba(255, 255, 255, 0.95);
    padding: 2.5rem 2rem;
    border-radius: 20px;
    width: 90%;
    max-width: 420px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
  .cover-subtitle {
    font-size: 0.85rem;
    letter-spacing: 3px;
    color: var(--s-col);
    margin-bottom: 1rem;
    text-transform: uppercase;
  }
  .cover-title {
    font-family: var(--f-fam);
    font-size: 2.4rem;
    line-height: 1.2;
    margin-bottom: 1rem;
    color: var(--p-col);
  }
  .cover-date {
    font-size: 0.9rem;
    letter-spacing: 2px;
    margin-bottom: 1.5rem;
    color: var(--p-col);
  }
  .guest-info {
    margin: 1.5rem 0;
    padding: 1rem;
    background: var(--a-col);
    border-radius: 12px;
  }
  .btn-open {
    background: var(--p-col);
    color: white;
    padding: 0.9rem 2.2rem;
    border-radius: 999px;
    border: none;
    font-weight: 700;
    cursor: pointer;
  }
  .audio-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: var(--p-col);
    color: #fff;
    z-index: 2000;
    cursor: pointer;
  }
  .main {
    position: relative;
    z-index: 1;
    padding: 3rem 1.5rem 5rem;
  }
  .hero {
    text-align: center;
    margin-bottom: 3rem;
    padding: 3rem 1.5rem;
    background: rgba(255, 255, 255, 0.85);
    border-radius: 20px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
  }
  .hero-subtitle {
    letter-spacing: 4px;
    text-transform: uppercase;
    font-size: 0.8rem;
    color: var(--s-col);
  }
  .hero-title {
    font-family: var(--f-fam);
    font-size: clamp(2.4rem, 6vw, 3.6rem);
    margin: 1rem 0;
    color: var(--p-col);
  }
  .hero-date {
    letter-spacing: 2px;
    font-weight: 600;
  }
  .section {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    padding: 2.5rem 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
  }
  .section-title {
    font-family: var(--f-fam);
    font-size: 1.9rem;
    color: var(--p-col);
    margin-bottom: 1rem;
  }
  .section-text {
    line-height: 1.7;
  }
  .event-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    margin-top: 1.5rem;
  }
  .event-card {
    background: white;
    padding: 1.5rem;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }
  .event-card h4 {
    color: var(--p-col);
    margin-bottom: 0.5rem;
  }
  .venue {
    margin-top: 1.5rem;
  }
  .venue-name {
    font-weight: 700;
    color: var(--p-col);
  }
  .venue-address {
    opacity: 0.8;
  }
  .btn-primary {
    display: inline-block;
    margin-top: 1rem;
    background: var(--p-col);
    color: white;
    padding: 0.7rem 1.4rem;
    border-radius: 10px;
    text-decoration: none;
  }
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.8rem;
  }
  .gallery-item {
    aspect-ratio: 1 / 1;
    border-radius: 12px;
    background-size: cover;
    background-position: center;
  }
  .bank-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }
  .bank-card {
    background: white;
    padding: 1.5rem;
    border-radius: 14px;
    text-align: center;
  }
  .acc-num {
    font-weight: 700;
    margin: 0.5rem 0;
  }
  .btn-secondary {
    background: var(--s-col);
    color: #fff;
    border: none;
    padding: 0.5rem 1.2rem;
    border-radius: 999px;
    cursor: pointer;
  }
  .form-card {
    background: white;
    padding: 1.5rem;
    border-radius: 16px;
  }
  .input {
    width: 100%;
    padding: 0.8rem 1rem;
    margin-bottom: 0.8rem;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  .full {
    width: 100%;
    text-align: center;
  }
  .wishes {
    margin-top: 1.5rem;
  }
  .wish-card {
    background: white;
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 0.8rem;
  }
  .wish-badge {
    margin-left: 0.5rem;
    font-size: 0.75rem;
    background: var(--a-col);
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
  }
  .footer {
    text-align: center;
    margin-top: 2rem;
    padding: 2rem 1rem;
    color: #fff;
    background: linear-gradient(135deg, var(--p-col), var(--s-col));
    border-radius: 20px;
  }
  .footer-names {
    font-family: var(--f-fam);
    font-size: 1.8rem;
    margin-top: 0.5rem;
  }
  .alert {
    padding: 0.6rem 0.8rem;
    border-radius: 10px;
    margin-bottom: 0.6rem;
    font-size: 0.85rem;
  }
  .alert.success {
    background: #dcfce7;
    color: #166534;
  }
  .alert.error {
    background: #fee2e2;
    color: #991b1b;
  }
</style>
