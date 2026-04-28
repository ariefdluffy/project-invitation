<script lang="ts">
  import { enhance } from "$app/forms";
  import { toast } from "$lib/toast.svelte";

  let { invitation, template, wishes = [], guestName = "", form } = $props();

  let isOpened = $state(false);
  let isPlaying = $state(false);
  let audioRef = $state<HTMLAudioElement | null>(null);
  let randomBg = $state("");

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

  const titleText = $derived.by(
    () =>
      customContent?.title ||
      template?.defaultContent?.title ||
      "The Wedding of",
  );

  const bankAccounts = $derived.by(() =>
    JSON.parse(invitation?.bank_accounts || "[]"),
  );
  const dressColors = $derived.by(() =>
    JSON.parse(invitation?.dress_code_colors || "[]"),
  );
  const galleryImages = $derived.by(() =>
    (invitation?.gallery_images || "")
      .split(/[\n,]+/)
      .map((u: string) => u.trim())
      .filter(Boolean),
  );

  const cssVars = $derived(`
		--p-col: ${template?.primary_color || "#0ea5e9"};
		--s-col: ${template?.secondary_color || "#22c55e"};
		--a-col: ${template?.accent_color || "#020617"};
		--f-fam: '${template?.font_family || "Space Grotesk"}', sans-serif;
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
    document.body.style.overflow = isOpened ? "auto" : "hidden";
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
  <title>{titleText} {invitation?.bride_name} & {invitation?.groom_name}</title>
  <meta
    name="description"
    content="Undangan {titleText} {invitation?.bride_name} & {invitation?.groom_name}"
  />
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Orbitron:wght@400;600;700&display=swap");
    body {
      background-color: var(--a-col) !important;
    }
  </style>
</svelte:head>

<div
  class="motion-root"
  style="{cssVars} {randomBg
    ? `background: url('${randomBg}') center/cover fixed no-repeat;`
    : ''}"
>
  <div class="neon-grid"></div>
  <div class="orb orb-one"></div>
  <div class="orb orb-two"></div>
  <div class="orb orb-three"></div>

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

  <div class="cover" class:open={isOpened}>
    <div class="cover-card">
      <p class="cover-eyebrow">{titleText}</p>
      <h1 class="cover-title">
        {invitation?.bride_name}<span>&</span>{invitation?.groom_name}
      </h1>
      <p class="cover-date">{formatDate(invitation?.akad_date)}</p>
      <div class="guest-info">
        <p>Kepada Yth. Bapak/Ibu/Saudara/i</p>
        <h3>{guestName}</h3>
      </div>
      <button class="btn-open" onclick={openInvitation}>Buka Undangan</button>
    </div>
  </div>

  {#if isOpened}
    <main class="content">
      <section class="hero">
        <p class="hero-eyebrow">{titleText}</p>
        <h2 class="hero-title">
          {invitation?.bride_name}
          <span>&</span>
          {invitation?.groom_name}
        </h2>
        <p class="hero-date">{formatDate(invitation?.akad_date)}</p>
      </section>

      <section class="glass-card">
        <h3>Dengan penuh cinta</h3>
        <p>
          {invitation?.quote ||
            "Kami mengundang Anda untuk menjadi bagian dari hari istimewa ini."}
        </p>
        <p class="quote-source">{invitation?.quote_source}</p>
      </section>

      <section class="grid-two">
        <div class="person-card">
          <h4>{invitation?.bride_name}</h4>
          <p class="person-full">{invitation?.bride_full_name}</p>
          <p class="person-parents">{invitation?.bride_parents}</p>
        </div>
        <div class="person-card">
          <h4>{invitation?.groom_name}</h4>
          <p class="person-full">{invitation?.groom_full_name}</p>
          <p class="person-parents">{invitation?.groom_parents}</p>
        </div>
      </section>

      <section class="timeline">
        <div class="event-card">
          <h4>Akad Nikah</h4>
          <p>{formatDate(invitation?.akad_date)}</p>
          <p>{invitation?.akad_time}</p>
        </div>
        <div class="event-card">
          <h4>Resepsi</h4>
          <p>{formatDate(invitation?.resepsi_date)}</p>
          <p>{invitation?.resepsi_time}</p>
        </div>
        {#if invitation?.venue_name}
          <div class="event-card full">
            <h4>Lokasi</h4>
            <p class="venue-name">{invitation?.venue_name}</p>
            <p class="venue-address">{invitation?.venue_address}</p>
            {#if invitation?.venue_map_url}
              <a
                class="btn-link"
                href={invitation.venue_map_url}
                target="_blank">Buka Google Maps</a
              >
            {/if}
          </div>
        {/if}
      </section>

      {#if galleryImages.length > 0}
        <section class="gallery">
          <h3>Moments in Motion</h3>
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
        <section class="glass-card">
          <h3>Wedding Gift</h3>
          <div class="gift-grid">
            {#each bankAccounts as acc}
              <div class="gift-card">
                <h4>{acc.bank}</h4>
                <p class="acc-num">{acc.number}</p>
                <p class="acc-name">a.n {acc.name}</p>
                <button
                  class="btn-mini"
                  onclick={() => copyToClipboard(acc.number)}>Copy</button
                >
              </div>
            {/each}
          </div>
        </section>
      {/if}

      {#if dressColors.length > 0}
        <section class="glass-card">
          <h3>Dress Code</h3>
          <div class="color-row">
            {#each dressColors as color}
              <span class="color-dot" style="background: {color};"></span>
            {/each}
          </div>
        </section>
      {/if}

      <section class="glass-card">
        <h3>RSVP & Wishes</h3>
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
            <button type="submit" class="btn-open full">Kirim Ucapan</button>
          </form>
        </div>
        <div class="wish-list">
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
        <p>Dengan penuh cinta</p>
        <h3>{invitation?.bride_name} & {invitation?.groom_name}</h3>
      </footer>
    </main>
  {/if}
</div>

<style>
  .motion-root {
    min-height: 100vh;
    color: #e2e8f0;
    font-family: var(--f-fam);
    position: relative;
    overflow: hidden;
    background: radial-gradient(
        circle at top,
        rgba(14, 165, 233, 0.2),
        transparent 60%
      ),
      linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 0.98));
  }
  .neon-grid {
    position: fixed;
    inset: 0;
    background-image: linear-gradient(
        rgba(14, 165, 233, 0.08) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(34, 197, 94, 0.08) 1px, transparent 1px);
    background-size: 120px 120px;
    transform: translateZ(0);
    z-index: 0;
    pointer-events: none;
  }
  .orb {
    position: fixed;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.35;
    z-index: 0;
    animation: float 18s ease-in-out infinite;
  }
  .orb-one {
    top: -120px;
    left: -80px;
    background: radial-gradient(circle, var(--p-col), transparent 70%);
  }
  .orb-two {
    bottom: -140px;
    right: -60px;
    background: radial-gradient(circle, var(--s-col), transparent 70%);
    animation-delay: -4s;
  }
  .orb-three {
    top: 35%;
    right: 15%;
    background: radial-gradient(
      circle,
      rgba(248, 250, 252, 0.35),
      transparent 70%
    );
    animation-delay: -9s;
  }
  @keyframes float {
    0%,
    100% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(40px, -30px, 0);
    }
  }
  .cover {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    backdrop-filter: blur(6px);
    transition: transform 0.8s ease;
  }
  .cover.open {
    transform: translateY(-110%);
  }
  .cover-card {
    width: min(480px, 92%);
    padding: 3rem 2.5rem;
    border-radius: 24px;
    background: rgba(15, 23, 42, 0.7);
    border: 1px solid rgba(14, 165, 233, 0.35);
    box-shadow: 0 20px 60px rgba(2, 6, 23, 0.65);
    text-align: center;
  }
  .cover-eyebrow {
    font-size: 0.85rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--s-col);
    margin-bottom: 1rem;
  }
  .cover-title {
    font-family: "Orbitron", sans-serif;
    font-size: clamp(2rem, 6vw, 3rem);
    margin: 0 0 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }
  .cover-title span {
    color: var(--p-col);
  }
  .cover-date {
    letter-spacing: 3px;
    margin-bottom: 1.5rem;
  }
  .guest-info {
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }
  .btn-open {
    background: linear-gradient(120deg, var(--p-col), var(--s-col));
    color: #020617;
    font-weight: 700;
    border: none;
    padding: 0.8rem 2.2rem;
    border-radius: 999px;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }
  .btn-open:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(14, 165, 233, 0.35);
  }
  .audio-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid rgba(148, 163, 184, 0.4);
    background: rgba(15, 23, 42, 0.6);
    color: #e2e8f0;
    z-index: 10;
    cursor: pointer;
  }
  .content {
    position: relative;
    z-index: 2;
    padding: 8rem 1.5rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }
  .hero {
    text-align: center;
  }
  .hero-eyebrow {
    letter-spacing: 6px;
    text-transform: uppercase;
    color: var(--s-col);
    font-size: 0.75rem;
  }
  .hero-title {
    font-family: "Orbitron", sans-serif;
    font-size: clamp(2.4rem, 6vw, 3.6rem);
    margin: 1rem 0;
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .hero-title span {
    color: var(--p-col);
  }
  .hero-date {
    letter-spacing: 3px;
  }
  .glass-card {
    background: rgba(15, 23, 42, 0.7);
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 22px;
    padding: 2rem;
    box-shadow: 0 12px 40px rgba(2, 6, 23, 0.4);
  }
  .grid-two {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }
  .person-card {
    padding: 1.8rem;
    border-radius: 20px;
    background: rgba(2, 6, 23, 0.7);
    border: 1px solid rgba(34, 197, 94, 0.2);
  }
  .person-card h4 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  .timeline {
    display: grid;
    gap: 1.2rem;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
  .event-card {
    padding: 1.4rem;
    border-radius: 18px;
    background: rgba(15, 23, 42, 0.7);
    border: 1px solid rgba(14, 165, 233, 0.2);
  }
  .event-card.full {
    grid-column: 1 / -1;
  }
  .btn-link {
    color: var(--p-col);
    text-decoration: none;
    font-weight: 600;
  }
  .gallery h3,
  .glass-card h3 {
    margin-bottom: 1rem;
  }
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.8rem;
  }
  .gallery-item {
    aspect-ratio: 1 / 1;
    border-radius: 16px;
    background-size: cover;
    background-position: center;
    border: 1px solid rgba(148, 163, 184, 0.2);
    box-shadow: 0 12px 30px rgba(2, 6, 23, 0.35);
  }
  .gift-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }
  .gift-card {
    padding: 1.2rem;
    border-radius: 16px;
    background: rgba(2, 6, 23, 0.7);
    border: 1px solid rgba(14, 165, 233, 0.2);
  }
  .acc-num {
    font-weight: 700;
    letter-spacing: 2px;
    margin: 0.5rem 0;
  }
  .btn-mini {
    background: rgba(14, 165, 233, 0.2);
    border: 1px solid rgba(14, 165, 233, 0.4);
    color: #e2e8f0;
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    cursor: pointer;
  }
  .color-row {
    display: flex;
    gap: 0.8rem;
  }
  .color-dot {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(148, 163, 184, 0.3);
  }
  .form-card {
    margin-top: 1rem;
    background: rgba(2, 6, 23, 0.7);
    padding: 1.5rem;
    border-radius: 18px;
    border: 1px solid rgba(148, 163, 184, 0.2);
  }
  .input {
    width: 100%;
    padding: 0.7rem 1rem;
    margin-bottom: 0.8rem;
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.3);
    background: rgba(15, 23, 42, 0.6);
    color: #e2e8f0;
  }
  .wish-list {
    margin-top: 1rem;
  }
  .wish-card {
    background: rgba(15, 23, 42, 0.7);
    border-radius: 14px;
    padding: 0.8rem;
    margin-bottom: 0.6rem;
  }
  .wish-badge {
    margin-left: 0.5rem;
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    background: rgba(14, 165, 233, 0.2);
  }
  .footer {
    text-align: center;
    padding: 2rem;
    border-radius: 20px;
    background: rgba(15, 23, 42, 0.8);
  }
  .alert {
    padding: 0.6rem 0.8rem;
    border-radius: 10px;
    margin-bottom: 0.6rem;
    font-size: 0.85rem;
  }
  .alert.success {
    background: rgba(34, 197, 94, 0.2);
    color: #bbf7d0;
  }
  .alert.error {
    background: rgba(239, 68, 68, 0.2);
    color: #fecaca;
  }
</style>
