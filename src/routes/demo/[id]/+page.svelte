<script lang="ts">
  import type { PageData, ActionData } from "./$types";
  import { enhance } from "$app/forms";
  import KhitanLayout from "$lib/components/invitations/KhitanLayout.svelte";
  import AqiqahLayout from "$lib/components/invitations/AqiqahLayout.svelte";
  import BirthdayLayout from "$lib/components/invitations/BirthdayLayout.svelte";
  import GatheringLayout from "$lib/components/invitations/GatheringLayout.svelte";
  import FormalLayout from "$lib/components/invitations/FormalLayout.svelte";
  import GeneralLayout from "$lib/components/invitations/GeneralLayout.svelte";
  import ThreeDMotionWedding from "$lib/components/invitations/ThreeDMotionWedding.svelte";
  import Tema31InspiredWedding from "$lib/components/invitations/Tema31InspiredWedding.svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const invitation = $derived(data.invitation);
  const template = $derived(data.template!);
  const wishes = $derived(data.wishes);
  const guestName = $derived(data.guestName);
  const category = $derived((template?.category || "wedding").toLowerCase());
  const isThreeDMotion = $derived(template?.id === "tmpl-3d-motion-wedding");
  const isTema31 = $derived(template?.id === "tmpl-tema-31-inspired");
  const isWedding = $derived(
    category === "wedding" ||
      category === "pernikahan" ||
      category === "anniversary",
  );
  const templateTitle = $derived(
    template?.defaultContent?.title || "THE WEDDING OF",
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
  const dressColors = $derived(
    JSON.parse(invitation.dress_code_colors || "[]"),
  );
  const galleryImages = $derived(
    (invitation.gallery_images || "")
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter(Boolean),
  );

  // Format Date Helper
  function formatDate(dateStr: string) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  import { toast } from "$lib/toast.svelte";

  // Copy to clipboard
  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Berhasil disalin: " + text);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Gagal menyalin");
    }
  }

  // Variables for template styles
  const cssVars = $derived(`
		--p-col: ${template.primary_color};
		--s-col: ${template.secondary_color};
		--a-col: ${template.accent_color};
		--f-fam: '${template.font_family}', serif;
	`);
  // Countdown Logic
  let timeLeft = $state({ d: 0, h: 0, m: 0, s: 0 });

  $effect(() => {
    if (!invitation.akad_date) return;

    // Robust date parsing using components
    const d = new Date(invitation.akad_date);
    if (isNaN(d.getTime())) return;

    const [hh, mm] = (invitation.akad_time || "00:00").split(":");

    // Create target date using local time components
    const targetDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      parseInt(hh || "0"),
      parseInt(mm || "0"),
      0,
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
        s: Math.floor((distance % (1000 * 60)) / 1000),
      };
    }, 1000);

    return () => clearInterval(interval);
  });

  // Scroll Reveal Logic
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
        { threshold: 0.1 },
      );

      const elements = document.querySelectorAll(".reveal");
      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }
  });
</script>

<svelte:head>
  <title
    >{templateTitle} {invitation.bride_name} & {invitation.groom_name}</title
  >
  <meta
    name="description"
    content="Undangan {templateTitle} {invitation.bride_name} & {invitation.groom_name}"
  />
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&display=swap");

    body {
      background-color: var(--a-col) !important;
    }
  </style>
</svelte:head>

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
  <div
    class="invitation-container template-{template.id} layout-{template.layout_style}"
    style="{cssVars} {randomBg
      ? `background: url('${randomBg}') center/cover fixed no-repeat;`
      : ''}"
  >
    <!-- Background Overlay for Blur -->
    <div class="bg-blur-overlay"></div>

    {#if invitation.music_url}
      <audio
        bind:this={audioRef}
        loop
        preload="auto"
        src={invitation.music_url}
        onerror={() =>
          console.error("Gagal memuat musik:", invitation.music_url)}
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

    <!-- COVER / ENVELOPE -->
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
          <h3>{guestName}</h3>
          <span>*Mohon maaf bila ada kesalahan penulisan nama/gelar</span>
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

    <!-- MAIN CONTENT -->
    {#if isOpened}
      <main class="invitation-main animate-fade-in">
        <!-- Hero -->
        <section class="section hero-sec reveal">
          <div class="hero-box">
            <p class="subtitle">{templateTitle}</p>
            <h2 class="names">
              {invitation.bride_name} <br />&<br />
              {invitation.groom_name}
            </h2>
            <p class="date">
              {invitation.akad_date
                ? new Date(invitation.akad_date)
                    .toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    .replace(/\//g, " . ")
                : ""}
            </p>

            <div class="countdown-container reveal delay-1">
              <div class="countdown-item">
                <span class="value">{timeLeft.d}</span>
                <span class="label">Hari</span>
              </div>
              <div class="countdown-item">
                <span class="value">{timeLeft.h}</span>
                <span class="label">Jam</span>
              </div>
              <div class="countdown-item">
                <span class="value">{timeLeft.m}</span>
                <span class="label">Menit</span>
              </div>
              <div class="countdown-item">
                <span class="value">{timeLeft.s}</span>
                <span class="label">Detik</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Quote -->
        {#if invitation.quote}
          <section class="section quote-sec reveal">
            <svg class="quote-icon" viewBox="0 0 24 24" fill="var(--p-col)"
              ><path
                d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
              /></svg
            >
            <p class="quote-text">"{invitation.quote}"</p>
            <p class="quote-source">- {invitation.quote_source} -</p>
          </section>
        {/if}

        <!-- Couple -->
        <section class="section couple-sec">
          <div class="section-heading">
            <h2 class="title">Bride & Groom</h2>
            <p>
              Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami
              bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara
              pernikahan kami:
            </p>
          </div>

          <div class="couple-card bride reveal delay-1">
            <div
              class="avatar"
              style="background-image: url({invitation.bride_photo ||
                'https://images.unsplash.com/photo-1546803076-2675b871c828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'})"
            ></div>
            <h3 class="name">{invitation.bride_name}</h3>
            <p class="full-name">{invitation.bride_full_name}</p>
            <p class="parents">{invitation.bride_parents}</p>
            {#if invitation.bride_instagram}
              <a
                href="https://instagram.com/{invitation.bride_instagram.replace(
                  '@',
                  '',
                )}"
                target="_blank"
                class="ig-link">📸 {invitation.bride_instagram}</a
              >
            {/if}
          </div>

          <div class="and-symbol">&</div>

          <div class="couple-card groom reveal delay-2">
            <div
              class="avatar"
              style="background-image: url({invitation.groom_photo ||
                'https://images.unsplash.com/photo-1550096141-7263640ae4d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'})"
            ></div>
            <h3 class="name">{invitation.groom_name}</h3>
            <p class="full-name">{invitation.groom_full_name}</p>
            <p class="parents">{invitation.groom_parents}</p>
            {#if invitation.groom_instagram}
              <a
                href="https://instagram.com/{invitation.groom_instagram.replace(
                  '@',
                  '',
                )}"
                target="_blank"
                class="ig-link">📸 {invitation.groom_instagram}</a
              >
            {/if}
          </div>
        </section>

        <!-- Event -->
        <section class="section event-sec">
          <div class="section-heading">
            <h2 class="title">Wedding Day</h2>
            <p>Acara InsyaAllah akan dilaksanakan pada:</p>
          </div>

          <div class="event-cards">
            <div class="event-card reveal delay-1">
              <h3>Akad Nikah</h3>
              <div class="event-details">
                <p>
                  <strong>{formatDate(invitation.akad_date)}</strong>
                </p>
                <p>Pukul {invitation.akad_time}</p>
              </div>
            </div>

            <div class="event-card reveal delay-2">
              <h3>Resepsi Pernikahan</h3>
              <div class="event-details">
                <p>
                  <strong>{formatDate(invitation.resepsi_date)}</strong>
                </p>
                <p>Pukul {invitation.resepsi_time}</p>
              </div>
            </div>
          </div>

          <div class="venue-info reveal">
            <h4>Bertempat di:</h4>
            <p class="venue-name">
              <strong>{invitation.venue_name}</strong>
            </p>
            <p class="venue-address" style="margin-bottom: 1.5rem;">
              {invitation.venue_address}
            </p>

            {#if invitation.venue_name}
              <div
                class="map-preview reveal zoom-in delay-1"
                style="margin-bottom: 1.5rem; border-radius: 15px; overflow: hidden; border: 1px solid rgba(0,0,0,0.1); box-shadow: 0 5px 15px rgba(0,0,0,0.05);"
              >
                <iframe
                  title="Lokasi Acara"
                  width="100%"
                  height="200"
                  frameborder="0"
                  style="border:0;"
                  src="https://maps.google.com/maps?q={encodeURIComponent(
                    invitation.venue_name +
                      ' ' +
                      (invitation.venue_address || ''),
                  )}&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  allowfullscreen
                ></iframe>
              </div>
            {/if}

            {#if invitation.venue_map_url}
              <a
                href={invitation.venue_map_url}
                target="_blank"
                class="btn-primary"
                style="display: inline-flex; align-items: center; gap: 0.5rem;"
                >📍 Buka Google Maps</a
              >
            {/if}
          </div>
        </section>

        <!-- Love Story -->
        {#if invitation.love_story}
          <section class="section story-sec reveal">
            <div class="section-heading">
              <h2 class="title">Our Story</h2>
              <p>
                Every love story in this universe is beautiful, but ours is my
                favorite.
              </p>
            </div>
            <div class="story-content">
              {#each invitation.love_story.split("\n\n") as paragraph}
                <p>{paragraph}</p>
              {/each}
            </div>
          </section>
        {/if}

        <!-- Gallery -->
        {#if galleryImages.length > 0}
          <section class="section gallery-sec">
            <div class="section-heading">
              <h2 class="title">Our Moments</h2>
              <p>
                Sebuah kebahagiaan bagi kami untuk membagikan momen-momen indah
                ini.
              </p>
            </div>
            <div class="gallery-grid">
              {#each galleryImages as img}
                <div
                  class="gallery-item reveal zoom-in"
                  style="background-image: url('{img}');"
                ></div>
              {/each}
            </div>
          </section>
        {/if}

        <!-- Wedding Gift -->
        {#if bankAccounts.length > 0}
          <section class="section gift-sec reveal">
            <div class="section-heading">
              <h2 class="title">Wedding Gift</h2>
              <p>
                Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
                Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat
                memberi kado secara cashless.
              </p>
            </div>

            <div class="bank-cards">
              {#each bankAccounts as acc}
                <div class="bank-card reveal">
                  <h4>Bank {acc.bank}</h4>
                  <p class="acc-num">{acc.number}</p>
                  <p class="acc-name">a.n {acc.name}</p>
                  <button
                    class="btn-copy"
                    onclick={() => copyToClipboard(acc.number)}
                    >📋 Copy Rekening</button
                  >
                </div>
              {/each}
            </div>
          </section>
        {/if}

        <!-- Dress Code -->
        {#if dressColors.length > 0}
          <section class="section dress-sec reveal">
            <div class="section-heading">
              <h2 class="title">Dress Code</h2>
              <p>
                Kami mengajak Bapak/Ibu/Saudara/i untuk menggunakan pakaian
                dengan palet warna berikut di hari istimewa kami.
              </p>
            </div>
            <div class="color-palette">
              {#each dressColors as color}
                <div
                  class="color-circle"
                  style="background-color: {color};"
                ></div>
              {/each}
            </div>
          </section>
        {/if}

        <!-- RSVP & Wishes -->
        <section class="section rsvp-sec reveal">
          <div class="section-heading">
            <h2 class="title">RSVP & Wishes</h2>
            <p>
              Mohon berkenan untuk memberikan doa & ucapan untuk mempelai serta
              konfirmasi kehadiran dengan mengisi form berikut:
            </p>
          </div>

          <div class="form-container">
            {#if form?.success}
              <div class="alert alert-success">
                Terima kasih atas doa dan ucapannya! 🎉
              </div>
            {/if}
            {#if form?.error}
              <div class="alert alert-danger">{form.error}</div>
            {/if}

            <form method="POST" action="?/wish" use:enhance>
              <input
                type="text"
                name="guest_name"
                class="form-input"
                placeholder="Nama Anda"
                value={guestName}
                required
              />
              <select name="is_attending" class="form-input" required>
                <option value="hadir">Hadir</option>
                <option value="tidak_hadir">Maaf, Tidak Bisa Hadir</option>
              </select>
              <textarea
                name="message"
                class="form-input"
                rows="4"
                placeholder="Tulis doa & ucapan selamat..."
                required
              ></textarea>
              <button type="submit" class="btn-primary w-full"
                >Kirim Ucapan</button
              >
            </form>
          </div>

          <div class="wishes-list">
            <h4 style="margin-bottom: 1rem; color: var(--p-col);">
              {wishes.length} Ucapan
            </h4>
            <div class="wishes-scroll">
              {#each wishes as wish}
                <div class="wish-card">
                  <div class="wish-head">
                    <strong>{wish.guest_name}</strong>
                    <span
                      class="wish-badge"
                      class:hadir={wish.is_attending === "hadir"}
                    >
                      {wish.is_attending === "hadir" ? "Hadir" : "Tidak Hadir"}
                    </span>
                  </div>
                  <div class="wish-date">
                    {new Date(wish.created_at).toLocaleDateString("id-ID")}
                  </div>
                  <p class="wish-text">{wish.message}</p>
                </div>
              {/each}
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="invitation-footer">
          <div
            class="footer-static-text"
            style="max-width: 80%; margin: 0 auto 3rem; font-style: italic; opacity: 0.9; line-height: 1.6;"
          >
            "Merupakan Suatu Kebahagiaan dan Kehormatan bagi Kami, Apabila
            Bapak/Ibu/Saudara/i, Berkenan Hadir di Acara kami"
          </div>

          <div class="hormat-kami" style="margin-bottom: 3rem;">
            <p style="font-size: 0.9rem; margin-bottom: 0.8rem; opacity: 0.8;">
              Hormat Kami,
            </p>
            <h3
              style="font-family: var(--f-fam); font-size: 1.3rem; color: white; line-height: 1.6;"
            >
              {#if invitation.respect_person}
                {#each invitation.respect_person.split("\n") as line}
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
      </main>
    {/if}
  </div>
{/if}

<style>
  /* Global Resets for Invitation */
  .invitation-container {
    font-family: "Montserrat", sans-serif;
    color: #333;
    background: var(--a-col);
    min-height: 100vh;
    position: relative;
    width: 100%;
    margin: 0 auto;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .bg-blur-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(6px);
    z-index: 0;
    pointer-events: none;
  }

  .title,
  .names,
  .cover-title {
    font-family: var(--f-fam);
    color: var(--p-col);
  }

  /* Audio Button */
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
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    border: none;
    animation: spin 8s linear infinite;
  }
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }

  /* Cover Section */
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
  .guest-info {
    margin: 2rem 0;
    padding: 1.5rem 1rem;
    background: var(--a-col);
    border-radius: 12px;
  }
  .guest-info h3 {
    font-size: 1.4rem;
    margin: 0.5rem 0;
    color: var(--p-col);
  }
  .guest-info span {
    font-size: 0.7rem;
    opacity: 0.7;
  }
  .btn-open {
    background: var(--p-col);
    color: white;
    padding: 0.8rem 2rem;
    border-radius: 50px;
    font-size: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    cursor: pointer;
    transition: transform 0.3s;
  }
  .btn-open:hover {
    transform: scale(1.05);
  }

  /* Common Section Styles */
  .section {
    padding: 5rem 1.5rem;
    text-align: center;
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    z-index: 1;
  }
  .section-heading {
    margin-bottom: 3rem;
  }
  .section-heading .title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  .section-heading p {
    font-size: 0.9rem;
    line-height: 1.6;
    opacity: 0.8;
  }
  .btn-primary {
    background: var(--p-col);
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    display: inline-block;
    transition: opacity 0.3s;
  }
  .btn-primary:hover {
    opacity: 0.9;
  }

  /* Hero */
  .hero-sec {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
  }
  .hero-box {
    padding: 4rem 2rem;
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 600px;
  }
  .hero-box .names {
    font-size: clamp(3rem, 8vw, 4.5rem);
    line-height: 1.2;
    margin: 1.5rem 0;
    text-shadow: 0 2px 10px rgba(255, 255, 255, 0.8);
  }
  .hero-box .subtitle,
  .hero-box .date {
    text-shadow: 0 1px 5px rgba(255, 255, 255, 0.8);
    font-weight: 600;
  }

  /* Quote */
  .quote-sec {
    background: transparent;
  }
  .quote-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  .quote-text {
    font-size: 1.1rem;
    font-style: italic;
    line-height: 1.8;
    margin-bottom: 1rem;
  }
  .quote-source {
    font-weight: 600;
    color: var(--p-col);
  }

  /* Couple */
  .couple-sec {
    display: flex;
    flex-direction: column;
  }
  .couple-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: center;
  }
  @media (min-width: 768px) {
    .couple-container {
      grid-template-columns: 1fr auto 1fr;
      gap: 1rem;
    }
  }
  .couple-card {
    margin-bottom: 2rem;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    padding: 3rem 2rem;
    border-radius: 24px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.6);
  }
  .avatar {
    width: 180px;
    height: 180px;
    margin: 0 auto 1.5rem;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    border: 5px solid white;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  .couple-card .name {
    font-family: var(--f-fam);
    font-size: 2.2rem;
    color: var(--p-col);
    margin-bottom: 0.5rem;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
  }
  .couple-card .full-name {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  .ig-link {
    display: inline-block;
    margin-top: 1.5rem;
    padding: 0.6rem 1.2rem;
    background: var(--p-col);
    border-radius: 50px;
    color: white;
    font-size: 0.8rem;
    text-decoration: none;
    transition:
      transform 0.2s,
      opacity 0.2s;
  }
  .ig-link:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
  .and-symbol {
    font-family: var(--f-fam);
    font-size: 4rem;
    color: var(--s-col);
    margin: 0;
    text-shadow: 0 2px 10px rgba(255, 255, 255, 0.8);
  }

  /* Event */
  .event-sec {
    background: transparent;
  }
  .event-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  @media (min-width: 768px) {
    .event-cards {
      grid-template-columns: 1fr 1fr;
    }
  }
  .event-card {
    padding: 2.5rem 2rem;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  }
  .event-card h3 {
    color: var(--p-col);
    margin-bottom: 1.5rem;
    font-family: var(--f-fam);
    font-size: 1.8rem;
    border-bottom: 2px solid var(--a-col);
    padding-bottom: 0.5rem;
    display: inline-block;
  }
  .event-details p {
    margin-bottom: 0.5rem;
    font-size: 1.05rem;
  }
  .venue-info {
    padding: 3rem 2rem;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  }
  .venue-name {
    font-size: 1.4rem;
    color: var(--p-col);
    margin: 1rem 0 0.5rem;
    font-weight: 600;
  }

  /* Story */
  .story-content {
    text-align: left;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
  .story-content p {
    margin-bottom: 1rem;
    line-height: 1.8;
    font-size: 0.95rem;
  }

  /* Gallery */
  .gallery-sec {
    background: transparent;
  }
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  @media (min-width: 600px) {
    .gallery-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
  }
  .gallery-item {
    width: 100%;
    aspect-ratio: 1 / 1;
    background-size: cover;
    background-position: center;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border: 3px solid rgba(255, 255, 255, 0.9);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .gallery-item:hover {
    transform: scale(1.05) rotate(1deg);
    z-index: 2;
  }

  /* Gift */
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

  /* Dress */
  .color-palette {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 2rem;
  }
  .color-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    border: 3px solid white;
  }

  /* RSVP */
  .rsvp-sec {
    background: transparent;
  }
  .form-container {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    padding: 3rem 2rem;
    border-radius: 20px;
    margin-bottom: 3rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.6);
  }
  .form-input {
    width: 100%;
    padding: 1.2rem;
    margin-bottom: 1.2rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    font-family: inherit;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    transition: border-color 0.2s;
  }
  .form-input:focus {
    outline: none;
    border-color: var(--p-col);
    background: #fff;
  }
  .w-full {
    width: 100%;
  }

  .alert {
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  .alert-success {
    background: #d4edda;
    color: #155724;
  }
  .alert-danger {
    background: #f8d7da;
    color: #721c24;
  }

  .wishes-scroll {
    max-height: 400px;
    overflow-y: auto;
    text-align: left;
    padding-right: 0.5rem;
  }
  .wish-card {
    padding: 1.2rem;
    background: #f9f9f9;
    border-radius: 12px;
    margin-bottom: 1rem;
    border-left: 4px solid var(--p-col);
  }
  .wish-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.3rem;
  }
  .wish-badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    background: #eee;
  }
  .wish-badge.hadir {
    background: #d4edda;
    color: #155724;
  }
  .wish-date {
    font-size: 0.75rem;
    color: #888;
    margin-bottom: 0.8rem;
  }
  .wish-text {
    font-size: 0.9rem;
    line-height: 1.5;
  }

  /* Footer */
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

  /* Countdown Styles */
  .countdown-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-top: 2.5rem;
    width: 100%;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .countdown-item {
    background: white;
    padding: 1rem 0.5rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .countdown-item .value {
    font-family: var(--f-fam);
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--p-col);
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .countdown-item .label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
    opacity: 0.7;
  }

  /* Template Specific Countdown Overrides */
  .template-celestial-night .countdown-item {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
  }
  .template-celestial-night .countdown-item .value {
    color: #ffd700;
  }

  .template-royal-midnight .countdown-item {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid var(--s-col);
  }
  .template-royal-midnight .countdown-item .value {
    color: var(--s-col);
  }

  .template-vintage-rustic .countdown-item {
    background: #e0d5c1;
    border: 2px solid #8d6e63;
    border-radius: 0;
  }

  @media (max-width: 480px) {
    .countdown-container {
      gap: 0.5rem;
    }
    .countdown-item {
      padding: 0.75rem 0.25rem;
    }
    .countdown-item .value {
      font-size: 1.4rem;
    }
    .countdown-item .label {
      font-size: 0.6rem;
    }
  }

  /* Scroll Reveal Styles */
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .reveal-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .reveal.zoom-in {
    transform: scale(0.9);
  }

  .reveal-visible.zoom-in {
    transform: scale(1);
  }

  .delay-1 {
    transition-delay: 0.2s;
  }
  .delay-2 {
    transition-delay: 0.4s;
  }
  .delay-3 {
    transition-delay: 0.6s;
  }

  /* Template Specific Diversifications */

  /* Modern Minimalist - Square & Clean */
  .template-modern-minimalist .couple-card {
    border-radius: 0;
    border-left: 4px solid var(--p-col);
    text-align: left;
    padding-left: 2rem;
  }
  .template-modern-minimalist .avatar {
    border-radius: 0; /* Square Avatar */
    border: 1px solid var(--p-col);
  }

  /* Javanese Elegance - Ornamental */
  .template-javanese-elegance .couple-card {
    border: 3px double var(--p-col);
    background: #fdf6e3;
    border-radius: 15px;
  }
  .template-javanese-elegance .avatar {
    border-radius: 50% 50% 0 0; /* Dome shape */
    border: 4px solid var(--p-col);
  }

  /* Royal Midnight - Hexagonal/Shield */
  .template-royal-midnight .avatar {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    border-radius: 0;
    background-color: var(--s-col);
  }
  .template-royal-midnight .couple-card {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: white;
    border: 1px solid var(--s-col);
  }

  /* Tropical Breeze - Organic/Blob */
  .template-tropical-breeze .avatar {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; /* Organic Blob */
    border: 5px solid var(--s-col);
  }
  .template-tropical-breeze .couple-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(5px);
    border-radius: 40px;
  }

  /* Minimalist Earth - Simple & Natural */
  .template-minimalist-earth .couple-card {
    border: none;
    background: #fefae0;
    box-shadow: none;
  }
  .template-minimalist-earth .avatar {
    border-radius: 20px;
    filter: grayscale(0.2);
  }

  /* Garden Romance - Soft & Floral */
  .template-garden-romance .couple-card {
    border-radius: 50px 5px 50px 5px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #ffc1e3;
  }
  .template-garden-romance .avatar {
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(212, 132, 155, 0.3);
  }

  /* Classic Elegance - Timeless Oval */
  .template-classic-elegance .avatar {
    border-radius: 120px 120px 0 0; /* Vertical Oval/Arch */
    border: 2px solid #d4af37;
  }
  .template-classic-elegance .couple-card {
    border: 1px solid #d4af37;
    background: #ffffff;
  }

  /* Soft Lavender - Dreamy Heart-like */
  .template-soft-lavender .avatar {
    border-radius: 40% 40% 50% 50%;
    border: 4px solid #e9d5ff;
  }
  .template-soft-lavender .couple-card {
    background: #faf5ff;
    border: 1px dashed #7e22ce;
  }

  /* Vintage Overrides */
  .template-vintage-rustic .couple-card {
    background-image: url("https://www.transparenttextures.com/patterns/old-map.png");
    border: 2px solid #8d6e63;
    box-shadow: 5px 5px 0px #8d6e63;
  }
  .template-vintage-rustic .avatar {
    filter: sepia(0.5);
    border-radius: 0;
    border: 3px solid #8d6e63;
  }

  /* Celestial Night Overrides */
  .template-celestial-night .couple-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(15px);
    color: white;
  }
  .template-celestial-night .couple-card .name {
    color: #ffd700;
  }
  .template-celestial-night .avatar {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
    border: 2px solid #ffd700;
  }

  /* Luxury Overrides */
  .template-luxury-emerald .venue-info {
    border: 2px double var(--s-col);
    background: white;
    position: relative;
  }
  .template-luxury-emerald .couple-card {
    border: 1px solid var(--s-col);
    box-shadow: 10px 10px 0px var(--a-col);
  }

  /* Responsive Overrides */
  @media (max-width: 600px) {
    .event-cards {
      grid-template-columns: 1fr;
    }
    .couple-card {
      padding: 2rem 1.5rem;
    }
  }
  /* Layout Specific Designs */

  /* MODERN LAYOUT */
  .layout-modern .hero-box {
    border-radius: 0;
    border: 4px solid var(--p-col);
    background: white;
  }
  .layout-modern .names {
    font-family: "Montserrat", sans-serif !important;
    text-transform: uppercase;
    letter-spacing: 5px;
    font-weight: 900;
  }
  .layout-modern .couple-card {
    border-radius: 0;
    box-shadow: 10px 10px 0 var(--s-col);
  }
  .layout-modern .event-card {
    border: 2px solid var(--p-col);
    border-radius: 0;
  }

  /* ROMANTIC LAYOUT */
  .layout-romantic .hero-box {
    border-radius: 100px 100px 0 0;
    border: none;
    background: rgba(255, 255, 255, 0.8);
  }
  .layout-romantic .names {
    font-family: "Great Vibes", cursive !important;
    font-size: 4rem;
  }
  .layout-romantic .couple-card {
    border-radius: 50% 50% 0 0;
    overflow: hidden;
  }
  .layout-romantic .section-heading .title::after {
    content: "🌸";
    margin-left: 10px;
  }

  /* LUXURY & ROYAL LAYOUT */
  .layout-luxury .invitation-container,
  .layout-royal .invitation-container {
    background: #000;
    color: #eee;
  }
  .layout-luxury .hero-box,
  .layout-royal .hero-box {
    border: 1px solid var(--s-col);
    background: linear-gradient(to bottom, #1a1a1a, #000);
  }
  .layout-luxury .names,
  .layout-royal .names {
    font-family: "Playfair Display", serif !important;
    letter-spacing: 2px;
  }
  .layout-luxury .couple-card,
  .layout-royal .couple-card {
    border: 1px solid var(--s-col);
    background: #111;
    color: white;
  }
  .layout-luxury .event-card,
  .layout-royal .event-card {
    background: #1a1a1a;
    border-top: 3px solid var(--s-col);
  }

  /* VINTAGE LAYOUT */
  .layout-vintage .invitation-container {
    background: #f4ece1;
  }
  .layout-vintage .hero-box {
    background: #fff;
    border: 2px dashed #8d6e63;
    border-radius: 8px;
  }
  .layout-vintage .names {
    font-family: "Special Elite", cursive !important;
    color: #5d4037;
  }
  .layout-vintage .couple-card {
    background: #fff;
    border: 1px solid #d7ccc8;
    transform: rotate(-2deg);
  }
  .layout-vintage .event-card {
    background: #fff;
    border-bottom: 5px solid #8d6e63;
  }

  /* CELESTIAL LAYOUT */
  .layout-celestial .invitation-container {
    background: #0f172a;
    color: #fff;
  }
  .layout-celestial .hero-box {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.3);
    border-radius: 50%;
    width: 350px;
    height: 350px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
  }
  .layout-celestial .names {
    font-family: "Cinzel Decorative", serif !important;
    font-size: 2.5rem;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
  .layout-celestial .couple-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 20px;
  }

  /* TROPICAL LAYOUT */
  .layout-tropical .invitation-container {
    background: #f0fdfa;
  }
  .layout-tropical .hero-box {
    border-left: 8px solid var(--p-col);
    background: white;
    padding-left: 2rem;
  }
  .layout-tropical .names {
    font-family: "Outfit", sans-serif !important;
    color: var(--p-col);
    font-weight: 800;
  }
  .layout-tropical .couple-card {
    border-radius: 30px;
    background: white;
    box-shadow: 0 10px 30px rgba(6, 95, 70, 0.1);
  }
</style>
