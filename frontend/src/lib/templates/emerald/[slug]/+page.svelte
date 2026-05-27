---
<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  // Data invitation
  let invitation = {
    groom_name: "",
    bride_name: "",
    wedding_date: "",
    akad_time: "",
    resepsi_time: "",
    akad_location: "",
    resepsi_location: "",
    akad_address: "",
    resepsi_address: "",
    music_url: "",
    gallery: [],
    wishes: [],
    template_config: {}
  };
  
  // UI state
  let showCover = true;
  let musicPlaying = false;
  let audio: HTMLAudioElement;
  let countdown: any;
  
  onMount(async () => {
    // Fetch invitation data
    const response = await fetch(`/api/invitations/${$page.params.slug}`);
    if (response.ok) {
      invitation = await response.json();
      invitation.template_config = JSON.parse(invitation.template_config);
    }
    
    // Check if user already opened
    const opened = localStorage.getItem(`invitation_${$page.params.slug}_opened`);
    if (opened) {
      showCover = false;
      initMusic();
    }
    
    // Initialize countdown
    initCountdown();
  });
  
  function initMusic() {
    if (invitation.music_url) {
      audio = new Audio(invitation.music_url);
      audio.loop = true;
      
      // Auto-play after user interaction
      document.addEventListener('click', () => {
        if (!musicPlaying && audio) {
          audio.play();
          musicPlaying = true;
        }
      });
    }
  }
  
  function initCountdown() {
    const weddingDate = new Date(invitation.wedding_date).getTime();
    countdown = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;
      
      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update countdown display
        document.getElementById('countdown-days').textContent = days.toString();
        document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');
      } else {
        clearInterval(countdown);
        document.getElementById('countdown-message').textContent = 'Pernikahan telah berlangsung!';
      }
    }, 1000);
  }
  
  function openInvitation() {
    showCover = false;
    localStorage.setItem(`invitation_${$page.params.slug}_opened`, 'true');
    
    if (invitation.music_url) {
      initMusic();
      audio.play();
      musicPlaying = true;
    }
  }
  
  function toggleMusic() {
    if (musicPlaying) {
      audio.pause();
      musicPlaying = false;
    } else {
      audio.play();
      musicPlaying = true;
    }
  }
  
  function submitRSVP() {
    const name = (document.getElementById('guest-name') as HTMLInputElement).value;
    const email = (document.getElementById('guest-email') as HTMLInputElement).value;
    const phone = (document.getElementById('guest-phone') as HTMLInputElement).value;
    const attending = (document.querySelector('input[name="attendance"]:checked') as HTMLInputElement)?.value;
    const wishes = (document.getElementById('guest-wishes') as HTMLInputElement).value;
    
    if (!name || !email) {
      alert('Nama dan email wajib diisi!');
      return;
    }
    
    const guestData = {
      invitation_id: invitation.id,
      name,
      email,
      phone,
      is_attending: attending === 'yes',
      token: btoa(`${email}-${Date.now()}`),
      wishes
    };
    
    fetch('/api/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guestData)
    }).then(response => {
      if (response.ok) {
        alert('RSVP berhasil! Terima kasih atas kehadirannya.');
        document.getElementById('rsvp-form').reset();
      } else {
        alert('Terjadi kesalahan. Silakan coba lagi.');
      }
    });
  }
</script>

<svelte:head>
  <title>{invitation.groom_name} ♡ {invitation.bride_name} - Undangan Pernikahan</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet">
</svelte:head>

<!-- Cover Screen -->
{#if showCover}
<div class="fixed inset-0 bg-gradient-to-br from-emerald-900 to-emerald-600 flex items-center justify-center z-50">
  <div class="text-center px-4">
    <h1 class="text-5xl md:text-7xl font-bold text-white mb-6" style="font-family: 'Great Vibes', cursive;">
      {invitation.groom_name} ♡ {invitation.bride_name}
    </h1>
    <p class="text-xl md:text-2xl text-emerald-100 mb-8">
      Segera Dibuka
    </p>
    <button 
      on:click={openInvitation}
      class="bg-white text-emerald-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-emerald-100 transition-colors duration-200"
    >
      Buka Undangan
    </button>
  </div>
</div>
{/if}

<!-- Main Invitation -->
<div class="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-600 relative" style="font-family: {invitation.template_config.fontFamily || 'Playfair Display'}">
  
  <!-- Navbar -->
    <nav class="fixed top-0 left-0 right-0 bg-gradient-to-r from-emerald-900/90 to-emerald-700/80 backdrop-blur-sm z-40 flex items-center justify-between px-4 py-3">
    <div class="flex items-center space-x-4">
      <div class="w-10 h-10 bg-emerald-300 rounded-full flex items-center justify-center">
        <span class="text-white font-bold text-lg">✨</span>
      </div>
      <span class="text-white font-bold text-lg">Wedding Invitation</span>
    </div>
    <div class="flex items-center space-x-2">
      <button 
        on:click={toggleMusic}
        class="p-2 bg-emerald-300 rounded-lg hover:bg-emerald-400 transition-colors duration-200"
      >
        {#if musicPlaying}
          <span class="text-white">⏸</span>
        {:else}
          <span class="text-white">▶</span>
        {/if}
      </button>
      <button 
        class="p-2 bg-emerald-300 rounded-lg hover:bg-emerald-400 transition-colors duration-200"
        on:click={() => goto(`/?guest=${btoa(invitation.id.toString())}`)}
      >
        <span class="text-white">📧</span>
      </button>
    </div>
  </nav>
  
  <!-- Header -->
  <header class="pt-32 md:pt-40 text-center">
    <h1 class="text-5xl md:text-7xl font-bold text-white mb-4" style="font-family: 'Great Vibes', cursive;">
      {invitation.groom_name} & {invitation.bride_name}
    </h1>
    <p class="text-2xl md:text-3xl text-emerald-100 mb-8">
      Bersama memasuki bahtera rumah tangga
    </p>
  </header>
  
  <!-- Countdown Timer -->
  <section class="bg-emerald-900/50 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto mb-12">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div class="bg-emerald-800/50 backdrop-blur-sm rounded-lg p-4">
        <div id="countdown-days" class="text-4xl md:text-5xl font-bold text-white mb-2">00</div>
        <div class="text-emerald-100 text-sm uppercase font-medium">Hari</div>
      </div>
      <div class="bg-emerald-800/50 backdrop-blur-sm rounded-lg p-4">
        <div id="countdown-hours" class="text-4xl md:text-5xl font-bold text-white mb-2">00</div>
        <div class="text-emerald-100 text-sm uppercase font-medium">Jam</div>
      </div>
      <div class="bg-emerald-800/50 backdrop-blur-sm rounded-lg p-4">
        <div id="countdown-minutes" class="text-4xl md:text-5xl font-bold text-white mb-2">00</div>
        <div class="text-emerald-100 text-sm uppercase font-medium">Menit</div>
      </div>
      <div class="bg-emerald-800/50 backdrop-blur-sm rounded-lg p-4">
        <div id="countdown-seconds" class="text-4xl md:text-5xl font-bold text-white mb-2">00</div>
        <div class="text-emerald-100 text-sm uppercase font-medium">Detik</div>
      </div>
    </div>
    <p id="countdown-message" class="text-emerald-100 text-center mt-4 font-medium">
      Menuju hari bahagia
    </p>
  </section>
  
  <!-- Couple Profile -->
  <section class="max-w-4xl mx-auto px-4 mb-16">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Groom -->
      <div class="bg-gradient-to-br from-emerald-900/50 to-emerald-700/30 backdrop-blur-sm rounded-2xl p-8 text-center">
        <div class="w-32 h-32 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-6xl">👨‍👩‍👧‍👦</span>
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">{invitation.groom_name}</h2>
        <p class="text-emerald-100">Calon Mempelai Pria</p>
        <p class="text-emerald-100 mt-4 italic">
          "{invitation.groom_quote || 'Cinta bukan hanya kata, tapi tindakan nyata.'}"
        </p>
      </div>
      
      <!-- Bride -->
      <div class="bg-gradient-to-br from-emerald-900/50 to-emerald-700/30 backdrop-blur-sm rounded-2xl p-8 text-center">
        <div class="w-32 h-32 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-6xl">👩‍👧‍👦</span>
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">{invitation.bride_name}</h2>
        <p class="text-emerald-100">Calon Mempelai Wanita</p>
        <p class="text-emerald-100 mt-4 italic">
          "{invitation.bride_quote || 'Bersamamu, setiap hari adalah berkah.'}"
        </p>
      </div>
    </div>
  </section>
  
  <!-- Events -->
  <section class="max-w-4xl mx-auto px-4 mb-16">
    <h2 class="text-3xl font-bold text-center text-white mb-8">Acara Pernikahan</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Akad -->
      <div class="bg-gradient-to-br from-emerald-900/40 to-emerald-700/20 backdrop-blur-sm rounded-2xl p-6">
        <div class="flex items-start space-x-3 mb-4">
          <div class="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-white text-xl">🎊</span>
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">Akad Nikah</h3>
            <p class="text-emerald-100">{invitation.akad_time || 'Pukul 08:00 WIB'}</p>
            <p class="text-emerald-100 mt-1">{invitation.akad_location || 'Masjid Jami'}</p>
            <p class="text-emerald-100 mt-1 italic">{invitation.akad_address || 'Jl. Contoh No. 123'}</p>
          </div>
        </div>
      </div>
      
      <!-- Resepsi -->
      <div class="bg-gradient-to-br from-emerald-900/40 to-emerald-700/20 backdrop-blur-sm rounded-2xl p-6">
        <div class="flex items-start space-x-3 mb-4">
          <div class="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-white text-xl">🎉</span>
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">Resepsi</h3>
            <p class="text-emerald-100">{invitation.resepsi_time || 'Pukul 11:00 WIB'}</p>
            <p class="text-emerald-100 mt-1">{invitation.resepsi_location || 'Gedung Pertemuan'}</p>
            <p class="text-emerald-100 mt-1 italic">{invitation.resepsi_address || 'Jl. Contoh No. 123'}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Gallery -->
  {#if invitation.gallery && invitation.gallery.length > 0}
  <section class="max-w-4xl mx-auto px-4 mb-16">
    <h2 class="text-3xl font-bold text-center text-white mb-8">Galeri Cinta</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {#each invitation.gallery.slice(0, 8) as image, index}
      <div class="relative group overflow-hidden rounded-2xl border-2 border-emerald-600/20 hover:border-emerald-400 transition-all duration-300">
        <img 
          src={image} 
          alt="Galeri {index + 1}"
          class="w-full h-32 md:h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        >
      </div>
      {/each}
    </div>
  </section>
  {/if}
  
  <!-- RSVP Form -->
  <section class="max-w-2xl mx-auto px-4 mb-16">
    <h2 class="text-3xl font-bold text-center text-white mb-8">Konfirmasi Kehadiran</h2>
    <form id="rsvp-form" class="bg-gradient-to-br from-emerald-900/40 to-emerald-700/20 backdrop-blur-sm rounded-2xl p-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-emerald-100 mb-2">Nama Lengkap</label>
          <input 
            id="guest-name"
            type="text" 
            required
            class="w-full px-4 py-2 bg-emerald-700/50 border border-emerald-600/50 rounded-lg text-white placeholder-emerald-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400 transition-colors duration-200"
            placeholder="Masukkan nama Anda..."
          >
        </div>
        <div>
          <label class="block text-emerald-100 mb-2">Email</label>
          <input 
            id="guest-email"
            type="email" 
            required
            class="w-full px-4 py-2 bg-emerald-700/50 border border-emerald-600/50 rounded-lg text-white placeholder-emerald-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400 transition-colors duration-200"
            placeholder="Masukkan email Anda..."
          >
        </div>
        <div>
          <label class="block text-emerald-100 mb-2">No. Telepon</label>
          <input 
            id="guest-phone"
            type="tel" 
            class="w-full px-4 py-2 bg-emerald-700/50 border border-emerald-600/50 rounded-lg text-white placeholder-emerald-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400 transition-colors duration-200"
            placeholder="Masukkan nomor telepon..."
          >
        </div>
        <div>
          <label class="block text-emerald-100 mb-2">Kehadiran</label>
          <div class="flex space-x-2">
            <label class="flex items-center">
              <input 
                type="radio" 
                name="attendance" 
                value="yes"
                class="form-radio h-4 w-4 text-emerald-400 bg-emerald-700 border-emerald-600 focus:ring-emerald-400"
              >
              <span class="ml-2 text-emerald-100">Hadir</span>
            </label>
            <label class="flex items-center">
              <input 
                type="radio" 
                name="attendance" 
                value="no"
                class="form-radio h-4 w-4 text-emerald-400 bg-emerald-700 border-emerald-600 focus:ring-emerald-400"
              >
              <span class="ml-2 text-emerald-100">Tidak Hadir</span>
            </label>
          </div>
        </div>
      </div>
      
      <div class="mt-4">
        <label class="block text-emerald-100 mb-2">Ucapan & Doa</label>
        <textarea 
          id="guest-wishes"
          rows="3"
          class="w-full px-4 py-2 bg-emerald-700 border border-emerald-600 rounded-lg text-white placeholder-emerald-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400 resize-none transition-colors duration-200"
          placeholder="Tulis ucapan dan doa untuk kami..."
        ></textarea>
      </div>
      
      <button 
        type="button"
        on:click={submitRSVP}
        class="w-full mt-6 bg-gradient-to-r from-emerald-400 to-emerald-600 text-emerald-900 font-bold py-3 rounded-lg hover:from-emerald-300 hover:to-emerald-500 transition-all duration-200 shadow-lg hover:shadow-emerald-600/25 transform hover:scale-105">
        Kirim Konfirmasi
      </button>
      </button>
    </form>
  </section>
  
  <!-- Digital Gift -->
  {#if invitation.template_config.showDigitalGift}
    <section class="max-w-2xl mx-auto px-4 mb-16">
    <h2 class="text-3xl font-bold text-center text-white mb-8">Digital Gift</h2>
    <div class="bg-gradient-to-br from-emerald-900/40 to-emerald-700/20 backdrop-blur-sm rounded-2xl p-8 text-center">
      <div class="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="text-white text-3xl">💎</span>
      </div>
      <p class="text-emerald-100 mb-4">
        Berikan dukungan digital untuk pernikahan kami
      </p>
      <div class="grid grid-cols-2 gap-4 max-w-xs mx-auto">
        <button class="bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-white font-bold py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-emerald-600/25 transform hover:scale-105">
          💎 E-Money
        </button>
        <button class="bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-white font-bold py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-emerald-600/25 transform hover:scale-105">
          💳 Transfer
        </button>
      </div>
    </div>
  </section>
  {/if}
  
  <!-- Footer -->
  <footer class="bg-gradient-to-r from-emerald-900/90 to-emerald-700/80 backdrop-blur-sm py-8 text-center">
    <p class="text-emerald-100">
      © 2024 {invitation.groom_name} & {invitation.bride_name}. Dibuat dengan ❤️ menggunakan Emerald Wedding Platform
    </p>
  </footer>
</div>

<style>
  .emerald-gradient {
    background: linear-gradient(135deg, #2D855A 0%, #50C878 100%);
  }
</style>