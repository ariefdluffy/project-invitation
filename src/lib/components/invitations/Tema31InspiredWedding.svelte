<script lang="ts">
  import { enhance } from "$app/forms";
  import { toast } from "$lib/toast.svelte";

  let { invitation, template, wishes = [], guestName = "", form = undefined } = $props();

  let isOpened = $state(false);
  let isPlaying = $state(false);
  let audioRef = $state<HTMLAudioElement | null>(null);
  let randomBg = $state("");
  let scrollCards = $state<NodeListOf<Element> | null>(null);
  let observer = $state<IntersectionObserver | null>(null);
  let useAnimations = $state(false);

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

  const customStyles = $derived.by(() => {
    return template?.custom_styles || {};
  });

  const titleText = $derived.by(
    () =>
      customContent?.title ||
      template?.defaultContent?.title ||
      "The Wedding of",
  );

  const galleryImages = $derived.by(() =>
    (invitation?.gallery_images || "")
      .split(/[\n,]+/)
      .map((u: string) => u.trim())
      .filter(Boolean),
  );

  const bankAccounts = $derived.by(() =>
    JSON.parse(invitation?.bank_accounts || "[]"),
  );

  const cssVars = $derived(`
		--p-col: ${template?.primary_color || "#d4a574"};
		--s-col: ${template?.secondary_color || "#1f2937"};
		--a-col: ${template?.accent_color || "#fdf7ef"};
		--f-fam: '${template?.font_family || "Cormorant Garamond"}', serif;
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

  $effect(() => {
    if (isOpened && useAnimations) {
      setTimeout(() => {
        initScrollAnimations();
        updateGalleryBackgrounds();
      }, 300);
    }
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

  function initScrollAnimations() {
    if (typeof window === "undefined") return;
    if (!useAnimations) return;

    const allCards = document.querySelectorAll(".scroll-card");
    allCards.forEach((card) => {
      card.classList.remove("animate-in");
    });

    const revealVisible = () => {
      allCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight * 0.85 && rect.bottom > 0) {
          card.classList.add("animate-in");
        }
      });
    };

    if (!("IntersectionObserver" in window)) {
      allCards.forEach((card) => card.classList.add("animate-in"));
      return;
    }

    scrollCards = document.querySelectorAll(".scroll-card");
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      },
    );

    scrollCards.forEach((card) => {
      observer?.observe(card);
    });

    revealVisible();

    // Fallback: ensure cards become visible even if observer misses initial paint.
    setTimeout(() => {
      const animatedCount = document.querySelectorAll(
        ".scroll-card.animate-in",
      ).length;
      if (animatedCount === 0) {
        allCards.forEach((card) => card.classList.add("animate-in"));
      }
    }, 600);
  }

  function updateGalleryBackgrounds() {
    if (galleryImages.length > 0) {
      // Set background images for gallery items
      const galleryItems = document.querySelectorAll(".gallery-item");
      galleryItems.forEach((item, index) => {
        if (galleryImages[index]) {
          (item as HTMLElement).style.backgroundImage =
            `url('${galleryImages[index]}')`;
        }
      });
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
    @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Marcellus&display=swap");
    body {
      background-color: var(--a-col) !important;
    }
  </style>
</svelte:head>

<div
  class="tema31"
  style="{cssVars} {randomBg
    ? `--bg-url: url('${randomBg}'); background: url('${randomBg}') center/cover fixed no-repeat;`
    : ''}"
>
  <div class="grain"></div>
  <div class="petal petal-one"></div>
  <div class="petal petal-two"></div>
  <div class="petal petal-three"></div>

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
      <p class="cover-subtitle">{titleText}</p>
      <h1 class="cover-title">
        {invitation?.bride_name}
        <span>&</span>
        {invitation?.groom_name}
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
    <main class="content" class:use-animations={useAnimations}>
      <section class="hero scroll-card">
        <p class="hero-subtitle">Save the Date</p>
        <h2 class="hero-title">
          {invitation?.bride_name} <span>&</span>
          {invitation?.groom_name}
        </h2>
        <p class="hero-date">{formatDate(invitation?.akad_date)}</p>
      </section>

      <section class="quote-card scroll-card">
        <h3>
          {invitation?.quote ||
            "Dengan penuh cinta kami mengundang Anda hadir di hari istimewa kami."}
        </h3>
        {#if invitation?.quote_source}
          <p class="quote-source">{invitation.quote_source}</p>
        {/if}
      </section>

      <section class="couple scroll-card">
        <div class="couple-card">
          <div
            class="image-frame"
            style="background-image: url({invitation?.bride_photo ||
              'https://images.unsplash.com/photo-1546803076-2675b871c828?auto=format&fit=crop&w=800&q=80'});"
          ></div>
          <h4>{invitation?.bride_name}</h4>
          <p>{invitation?.bride_full_name}</p>
          <p class="parents">{invitation?.bride_parents}</p>
        </div>
        <div class="couple-card">
          <div
            class="image-frame"
            style="background-image: url({invitation?.groom_photo ||
              'https://images.unsplash.com/photo-1550096141-7263640ae4d9?auto=format&fit=crop&w=800&q=80'});"
          ></div>
          <h4>{invitation?.groom_name}</h4>
          <p>{invitation?.groom_full_name}</p>
          <p class="parents">{invitation?.groom_parents}</p>
        </div>
      </section>

      <section class="event-grid scroll-card">
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
        <section class="gallery scroll-card">
          <h3>Galeri Foto</h3>
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

      {#if invitation?.love_story}
        <section class="story scroll-card">
          <h3>Love Story</h3>
          {#each invitation.love_story.split("\n\n") as paragraph}
            <p>{paragraph}</p>
          {/each}
        </section>
      {/if}

      <section class="rsvp scroll-card">
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
            <button type="submit" class="btn-open">Kirim Ucapan</button>
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

      {#if bankAccounts.length > 0}
        <section class="gift">
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

      <footer class="footer">
        <h3>Join Our Wedding</h3>
        <p>{invitation?.bride_name} & {invitation?.groom_name}</p>
        <span>{formatDate(invitation?.akad_date)}</span>
      </footer>
    </main>
  {/if}
</div>

<style>
  .tema31 {
    min-height: 100vh;
    color: var(--s-col);
    font-family: var(--f-fam);
    position: relative;
    overflow: hidden;
    background: radial-gradient(
        circle at top,
        rgba(212, 165, 116, 0.2),
        transparent 60%
      ),
      linear-gradient(
        180deg,
        rgba(253, 247, 239, 0.98),
        rgba(255, 255, 255, 0.92)
      );
  }
  .tema31::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 0;
    background: var(--bg-url) center/cover fixed no-repeat;
    filter: blur(1px);
    transform: scale(1.03);
    opacity: 0.25;
  }
  .grain {
    position: fixed;
    inset: 0;
    background-image: url("https://www.transparenttextures.com/patterns/paper-fibers.png");
    opacity: 0.2;
    pointer-events: none;
    z-index: 0;
  }
  .petal {
    position: fixed;
    width: 220px;
    height: 220px;
    border-radius: 45% 55% 65% 35%;
    filter: blur(2px);
    opacity: 0.25;
    animation: drift 18s ease-in-out infinite;
    z-index: 0;
  }
  .petal-one {
    top: -80px;
    left: -40px;
    background: radial-gradient(
      circle,
      rgba(212, 165, 116, 0.45),
      transparent 70%
    );
  }
  .petal-two {
    bottom: -100px;
    right: -60px;
    background: radial-gradient(circle, rgba(31, 41, 55, 0.2), transparent 70%);
    animation-delay: -5s;
  }
  .petal-three {
    top: 45%;
    right: 10%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.6),
      transparent 70%
    );
    animation-delay: -9s;
  }
  @keyframes drift {
    0%,
    100% {
      transform: translate3d(0, 0, 0) rotate(0deg);
    }
    50% {
      transform: translate3d(30px, -25px, 0) rotate(6deg);
    }
  }
  .cover {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    backdrop-filter: blur(2px);
    transition: transform 0.8s ease;
  }
  .cover.open {
    transform: translateY(-110%);
  }
  .cover-card {
    background: rgba(255, 255, 255, 0.82);
    padding: 3rem 2.5rem;
    border-radius: 24px;
    border: 1px solid rgba(212, 165, 116, 0.35);
    box-shadow: 0 20px 60px rgba(31, 41, 55, 0.18);
    text-align: center;
    width: min(480px, 92%);
  }
  .cover-subtitle {
    letter-spacing: 4px;
    text-transform: uppercase;
    font-size: 0.75rem;
    margin-bottom: 1rem;
    color: rgba(31, 41, 55, 0.7);
  }
  .cover-title {
    font-family: "Marcellus", serif;
    font-size: clamp(2.2rem, 5vw, 3rem);
    margin: 0 0 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.6rem;
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
  }
  .btn-open {
    background: linear-gradient(120deg, var(--p-col), #f5d29f);
    color: #1f2937;
    font-weight: 600;
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
    box-shadow: 0 10px 24px rgba(212, 165, 116, 0.3);
  }
  .audio-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid rgba(31, 41, 55, 0.2);
    background: rgba(255, 255, 255, 0.8);
    color: #1f2937;
    z-index: 10;
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
  .hero-subtitle {
    letter-spacing: 6px;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: rgba(31, 41, 55, 0.6);
  }
  .hero-title {
    font-family: "Marcellus", serif;
    font-size: clamp(2.5rem, 6vw, 3.6rem);
    margin: 1rem 0;
  }
  .hero-title span {
    color: var(--p-col);
  }
  .quote-card {
    background: rgba(255, 255, 255, 0.82);
    border-radius: 22px;
    padding: 2rem;
    box-shadow: 0 12px 40px rgba(31, 41, 55, 0.08);
    text-align: center;
  }
  .couple {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }
  .couple-card {
    background: rgba(255, 255, 255, 0.82);
    border-radius: 22px;
    padding: 1.8rem;
    text-align: center;
    box-shadow: 0 12px 32px rgba(31, 41, 55, 0.1);
  }
  .image-frame {
    width: 160px;
    height: 160px;
    margin: 0 auto 1rem;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    border: 6px solid rgba(212, 165, 116, 0.3);
    box-shadow: 0 10px 24px rgba(31, 41, 55, 0.15);
  }
  .parents {
    font-size: 0.9rem;
    color: rgba(31, 41, 55, 0.7);
  }
  .event-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.2rem;
  }
  .event-card {
    background: rgba(255, 255, 255, 0.84);
    border-radius: 18px;
    padding: 1.5rem;
    box-shadow: 0 10px 24px rgba(31, 41, 55, 0.08);
  }
  .event-card.full {
    grid-column: 1 / -1;
  }
  .btn-link {
    color: var(--p-col);
    font-weight: 600;
    text-decoration: none;
  }
  .gallery {
    background: rgba(255, 255, 255, 0.82);
    border-radius: 22px;
    padding: 2rem;
  }
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.8rem;
  }
  .gallery-item {
    aspect-ratio: 1 / 1;
    border-radius: 14px;
    background-size: cover;
    background-position: center;
    box-shadow: 0 10px 24px rgba(31, 41, 55, 0.15);
  }
  .story {
    background: rgba(255, 255, 255, 0.82);
    border-radius: 22px;
    padding: 2rem;
    line-height: 1.7;
  }
  .rsvp {
    background: rgba(255, 255, 255, 0.82);
    border-radius: 22px;
    padding: 2rem;
  }
  .form-card {
    margin-top: 1rem;
  }
  .input {
    width: 100%;
    padding: 0.7rem 1rem;
    margin-bottom: 0.8rem;
    border-radius: 12px;
    border: 1px solid rgba(31, 41, 55, 0.15);
  }
  .wish-list {
    margin-top: 1rem;
  }
  .wish-card {
    background: rgba(255, 255, 255, 0.84);
    border-radius: 12px;
    padding: 0.8rem;
    margin-bottom: 0.6rem;
  }
  .wish-badge {
    margin-left: 0.5rem;
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    background: rgba(212, 165, 116, 0.2);
  }
  .gift {
    background: rgba(255, 255, 255, 0.82);
    border-radius: 22px;
    padding: 2rem;
  }
  .gift-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }
  .gift-card {
    padding: 1.2rem;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.84);
    box-shadow: 0 10px 22px rgba(31, 41, 55, 0.08);
  }
  .acc-num {
    font-weight: 700;
    letter-spacing: 2px;
    margin: 0.5rem 0;
  }
  .btn-mini {
    background: rgba(212, 165, 116, 0.25);
    border: none;
    padding: 0.4rem 1rem;
    border-radius: 999px;
    cursor: pointer;
  }
  .footer {
    text-align: center;
    padding: 2rem;
    background: rgba(31, 41, 55, 0.9);
    color: #fff;
    border-radius: 22px;
  }
  .alert {
    padding: 0.6rem 0.8rem;
    border-radius: 10px;
    margin-bottom: 0.6rem;
  }
  .alert.success {
    background: #dcfce7;
    color: #166534;
  }
  .alert.error {
    background: #fee2e2;
    color: #991b1b;
  }
  @media (max-width: 720px) {
    .cover-title {
      flex-direction: column;
    }
  }

  /* Scroll Animations */
  .scroll-card {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .content.use-animations .scroll-card {
    opacity: 0;
    transform: translateY(60px) scale(0.95);
    transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: opacity, transform;
  }

  .content.use-animations .scroll-card.animate-in {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  /* Staggered animations with delays */
  .content.use-animations .scroll-card:nth-child(1) {
    transition-delay: 0.1s;
  }
  .content.use-animations .scroll-card:nth-child(2) {
    transition-delay: 0.3s;
  }
  .content.use-animations .scroll-card:nth-child(3) {
    transition-delay: 0.5s;
  }
  .content.use-animations .scroll-card:nth-child(4) {
    transition-delay: 0.7s;
  }
  .content.use-animations .scroll-card:nth-child(5) {
    transition-delay: 0.9s;
  }
  .content.use-animations .scroll-card:nth-child(6) {
    transition-delay: 1.1s;
  }

  /* Gallery background fix */
  .gallery-item {
    background-size: cover !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
  }

  /* Glass effect for cards */
  /* .glass-card {
    background: rgba(255, 255, 255, 0.85);
    background: rgba(255, 255, 255, 0.84);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  } */

  /* Floating elements animation */
  .petal {
    position: fixed;
    pointer-events: none;
    animation: float 20s infinite linear;
    z-index: 1;
  }

  .petal-one {
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }

  .petal-two {
    top: 20%;
    right: 10%;
    animation-delay: 5s;
  }

  .petal-three {
    bottom: 20%;
    left: 20%;
    animation-delay: 10s;
  }

  @keyframes float {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    33% {
      transform: translateY(-20px) rotate(120deg);
    }
    66% {
      transform: translateY(-40px) rotate(240deg);
    }
    100% {
      transform: translateY(0) rotate(360deg);
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .content.use-animations .scroll-card {
      transform: translateY(30px);
    }

    .content.use-animations .scroll-card.animate-in {
      transform: translateY(0);
    }
  }
</style>
