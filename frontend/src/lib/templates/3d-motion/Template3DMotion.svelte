<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  // Template configuration
  export let invitation = {
    primary_color: '#0066FF',
    secondary_color: '#00FFCC',
    font_family: 'Arial, sans-serif',
    background_type: '3d',
    show_countdown: true,
    show_gallery: true,
    show_map: true,
    music_url: '',
    wedding_date: new Date(),
    akad_date: new Date(),
    resepsi_date: new Date()
  };
  
  // 3D Scene
  let scene, camera, renderer, cube;
  let container;
  let animationId;
  let isMobile = false;
  let mouseX = 0, mouseY = 0;
  
  // Audio
  let audio;
  let musicPlaying = false;
  let audioContext;
  let analyser;
  let dataArray;
  let bufferLength;
  
  // Motion effects
  let particles = [];
  let particleCount = 50;
  let mouseXPercent = 50;
  let mouseYPercent = 50;
  
  // Parallax layers
  let layers = [];
  let layerDepths = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
  
  onMount(async () => {
    // Detect mobile
    isMobile = window.innerWidth <= 768;
    
    // Initialize 3D scene
    init3DScene();
    initParticles();
    initParallax();
    initAudio();
    
    // Start animation
    animate();
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup on destroy
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (audio) audio.pause();
      if (audioContext) audioContext.close();
    };
  });
  
  function init3DScene() {
    const container = document.querySelector('.3d-motion-background');
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    
    // Add to DOM
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Camera position
    camera.position.z = 5;
    camera.position.y = 1;
    
    // Create floating elements
    createFloatingElements();
  }
  
  function createFloatingElements() {
    // Create multiple floating shapes
    for (let i = 0; i < 15; i++) {
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(`hsl(${Math.random() * 60 + 180}, 70%, 50%)`),
        shininess: 100
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      // Random position
      mesh.position.x = (Math.random() - 0.5) * 10;
      mesh.position.y = (Math.random() - 0.5) * 10;
      mesh.position.z = -Math.random() * 10;
      
      // Random rotation
      mesh.rotation.x = Math.random() * Math.PI * 2;
      mesh.rotation.y = Math.random() * Math.PI * 2;
      
      scene.add(mesh);
    }
  }
  
  function initParticles() {
    const container = document.querySelector('.particle-container');
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.width = Math.random() * 4 + 1 + 'px';
      particle.style.height = particle.style.width;
      particle.style.background = `linear-gradient(45deg, ${invitation.primary_color}, ${invitation.secondary_color})`;
      particle.style.boxShadow = `0 0 10px ${invitation.primary_color}`;
      particle.style.position = 'absolute';
      particle.style.pointerEvents = 'none';
      
      container.appendChild(particle);
      particles.push(particle);
    }
  }
  
  function initParallax() {
    // Create parallax layers
    const parallaxContainer = document.querySelector('.parallax-container');
    
    for (let i = 0; i < 9; i++) {
      const layer = document.createElement('div');
      layer.className = 'parallax-layer';
      layer.style.background = `linear-gradient(135deg, ${invitation.primary_color} 0%, ${invitation.secondary_color} 100%)`;
      layer.style.opacity = (i + 1) / 10;
      layer.style.transform = `translateZ(${layerDepths[i]}px) scale(${1 + layerDepths[i] * 0.01})`;
      layer.style.position = 'absolute';
      layer.style.top = 0;
      layer.style.left = 0;
      layer.style.width = '100%';
      layer.style.height = '100%';
      layer.style.pointerEvents = 'none';
      
      parallaxContainer.appendChild(layer);
      layers.push(layer);
    }
  }
  
  function initAudio() {
    if (!invitation.music_url) return;
    
    // Create audio element
    audio = new Audio(invitation.music_url);
    audio.loop = true;
    audio.volume = 0.5;
    
    // Web Audio API for visualization
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }
  
  function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Update 3D scene
    if (scene && camera && renderer) {
      // Rotate floating elements
      scene.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.x += 0.005;
          child.rotation.y += 0.01;
          child.position.z += Math.sin(Date.now() * 0.001 + index) * 0.001;
        }
      });
      
      // Update camera based on mouse
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      
      renderer.render(scene, camera);
    }
    
    // Update particles
    particles.forEach((particle, index) => {
      const rect = particle.getBoundingClientRect();
      const speed = (index + 1) * 0.5;
      
      // Move particles
      particle.style.transform = `translateY(${((Date.now() * 0.01) + (index * 10)) % window.innerHeight}px)`;
      
      // Fade out when near bottom
      if (rect.top > window.innerHeight) {
        particle.style.opacity = '0';
      } else {
        particle.style.opacity = '1';
      }
    });
    
    // Update parallax
    layers.forEach((layer, index) => {
      const depth = layerDepths[index];
      const mouseXOffset = (mouseXPercent - 50) * depth * 0.1;
      const mouseYOffset = (mouseYPercent - 50) * depth * 0.1;
      
      layer.style.transform = `translate(${mouseXOffset}px, ${mouseYOffset}px) translateZ(${depth}px) scale(${1 + depth * 0.01})`;
    });
    
    // Update audio visualization
    if (analyser && dataArray) {
      analyser.getByteFrequencyData(dataArray);
      
      // Use frequency data to influence particle movement
      const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
      
      particles.forEach((particle, index) => {
        const scale = 1 + (dataArray[index % bufferLength] / 255) * 0.5;
        particle.style.transform += ` scale(${scale})`;
      });
    }
  }
  
  function handleResize() {
    if (!camera || !renderer) return;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  function handleMouseMove(event) {
    if (isMobile) return;
    
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    mouseXPercent = (event.clientX / window.innerWidth) * 100;
    mouseYPercent = (event.clientY / window.innerHeight) * 100;
  }
  
  function toggleMusic() {
    if (!audio) return;
    
    musicPlaying = !musicPlaying;
    
    if (musicPlaying) {
      audio.play().then(() => {
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
      }).catch(error => {
        console.log('Audio playback failed:', error);
        musicPlaying = false;
      });
    } else {
      audio.pause();
    }
  }
  
  function formatCountdown(date) {
    const now = new Date();
    const diff = date - now;
    
    if (diff <= 0) return 'Waktunya Tiba!';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
</script>

<!-- 3D Motion Background Template -->
<div class="3d-motion-template">
  <!-- 3D Background -->
  <div class="3d-motion-background">
    <div class="parallax-container"></div>
    <div class="particle-container"></div>
  </div>
  
  <!-- Content Overlay -->
  <div class="content-overlay">
    <!-- Header -->
    <header class="template-header" style="background: linear-gradient(135deg, {invitation.primary_color} 0%, {invitation.secondary_color} 100%);">
      <div class="header-content">
        <h1 style="font-family: {invitation.font_family}; color: white;">
          {invitation.groom_name} & {invitation.bride_name}
        </h1>
        <div class="subtitle" style="color: rgba(255,255,255,0.9);">
          Mengundang kebahagiaan Anda
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="template-main">
      <!-- Countdown Timer -->
      {#if invitation.show_countdown}
        <div class="countdown-container" in:fly="{{y: 20, duration: 1000, easing: quintOut}}">
          <div class="countdown-title">Menunggu Hari Bahagia</div>
          <div class="countdown-time">{formatCountdown(invitation.wedding_date)}</div>
        </div>
      {/if}
      
      <!-- Couple Info -->
      <div class="couple-info" in:fly="{{y: 20, duration: 1000, delay: 200, easing: quintOut}}">
        <div class="couple-grid">
          <div class="couple-card">
            <div class="couple-photo groom-photo" style="background-image: url({invitation.groom_photo});"></div>
            <h3 style="font-family: {invitation.font_family};">{invitation.groom_name}</h3>
            <p>{invitation.groom_title}</p>
          </div>
          <div class="couple-card">
            <div class="couple-photo bride-photo" style="background-image: url({invitation.bride_photo});"></div>
            <h3 style="font-family: {invitation.font_family};">{invitation.bride_name}</h3>
            <p>{invitation.bride_title}</p>
          </div>
        </div>
      </div>
      
      <!-- Event Details -->
      <div class="events-container" in:fly="{{y: 20, duration: 1000, delay: 400, easing: quintOut}}">
        <div class="event-card">
          <div class="event-icon">🎊</div>
          <div class="event-details">
            <h3>Akad Nikah</h3>
            <p>{new Date(invitation.akad_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p>Pukul {new Date(invitation.akad_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
        
        <div class="event-card">
          <div class="event-icon">🎉</div>
          <div class="event-details">
            <h3>Resepsi</h3>
            <p>{new Date(invitation.resepsi_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p>Pukul {new Date(invitation.resepsi_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </div>
      
      <!-- Gallery -->
      {#if invitation.show_gallery && invitation.gallery_images && invitation.gallery_images.length > 0}
        <div class="gallery-container" in:fly="{{y: 20, duration: 1000, delay: 600, easing: quintOut}}">
          <h2 style="font-family: {invitation.font_family};">Kenangan Manis</h2>
          <div class="gallery-grid">
            {#each invitation.gallery_images as image, index}
              <div class="gallery-item" style="background-image: url({image});" in:fade="{{delay: index * 100}}">
                <div class="gallery-overlay">
                  <div class="gallery-zoom">🔍</div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
      
      <!-- Music Player -->
      {#if invitation.music_url}
        <div class="music-player" in:fly="{{y: 20, duration: 1000, delay: 800, easing: quintOut}}">
          <div class="music-button" on:click={toggleMusic} style="background: {musicPlaying ? '#FF6B6B' : invitation.primary_color};">
            {musicPlaying ? '⏹️' : '▶️'}
          </div>
          <div class="music-info">
            <div class="music-title">Lantunan Bahagia</div>
            <div class="music-status">{musicPlaying ? 'Playing' : 'Paused'}</div>
          </div>
        </div>
      {/if}
      
      <!-- RSVP Section -->
      <div class="rsvp-container" in:fly="{{y: 20, duration: 1000, delay: 1000, easing: quintOut}}">
        <h2 style="font-family: {invitation.font_family};">Kehadiran Anda</h2>
        <div class="rsvp-buttons">
          <button class="rsvp-button yes" style="background: {invitation.secondary_color};">
            ✅ Akan Hadir
          </button>
          <button class="rsvp-button no" style="background: {invitation.primary_color};">
            ❌ Tidak Bisa
          </button>
        </div>
        <textarea class="wishes-input" placeholder="Tinggalkan doa dan pesan untuk kami..." style="font-family: {invitation.font_family};"></textarea>
        <button class="submit-wishes" style="background: {invitation.primary_color};">
          Kirim Pesan
        </button>
      </div>
    </main>
    
    <!-- Footer -->
    <footer class="template-footer" style="background: rgba(0,0,0,0.8);">
      <div class="footer-content">
        <p style="color: white; font-family: {invitation.font_family};">
          © {new Date().getFullYear()} {invitation.groom_name} & {invitation.bride_name}
        </p>
      </div>
    </footer>
  </div>
</div>

<style>
/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  overflow-x: hidden;
  background: #000;
}

/* 3D Motion Template */
.3d-motion-template {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* 3D Background */
.3d-motion-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.parallax-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: float 20s infinite linear;
}

@keyframes float {
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(100vh) scale(0.5); }
  100% { transform: translateY(0) scale(1); }
}

/* Content Overlay */
.content-overlay {
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: 100vh;
}

/* Header */
.template-header {
  width: 100%;
  padding: 2rem 0;
  position: relative;
  overflow: hidden;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 0 2rem;
}

.header-content h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  letter-spacing: 2px;
}

.subtitle {
  font-size: 1.2rem;
  font-weight: 300;
}

/* Main Content */
.template-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

/* Countdown Timer */
.countdown-container {
  text-align: center;
  margin-bottom: 3rem;
  background: rgba(255,255,255,0.1);
  padding: 2rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.countdown-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
}

.countdown-time {
  font-size: 2rem;
  font-weight: bold;
  color: #00FFCC;
  letter-spacing: 2px;
}

/* Couple Info */
.couple-info {
  margin-bottom: 3rem;
}

.couple-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.couple-card {
  text-align: center;
  background: rgba(255,255,255,0.05);
  padding: 2rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.couple-card:hover {
  transform: translateY(-5px);
}

.couple-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  background-size: cover;
  background-position: center;
  border: 3px solid rgba(255,255,255,0.3);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.couple-card h3 {
  color: white;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.couple-card p {
  color: rgba(255,255,255,0.8);
  font-size: 1rem;
}

/* Events */
.events-container {
  margin-bottom: 3rem;
}

.event-card {
  background: rgba(255,255,255,0.05);
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.event-card:hover {
  transform: translateX(10px);
}

.event-icon {
  font-size: 2rem;
  margin-right: 1rem;
  min-width: 50px;
  text-align: center;
}

.event-details h3 {
  color: white;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.event-details p {
  color: rgba(255,255,255,0.8);
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

/* Gallery */
.gallery-container {
  margin-bottom: 3rem;
}

.gallery-container h2 {
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.gallery-item {
  aspect-ratio: 1;
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.gallery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.gallery-zoom {
  font-size: 2rem;
  color: white;
}

/* Music Player */
.music-player {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.music-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.music-button:hover {
  transform: scale(1.1);
}

.music-info {
  flex: 1;
}

.music-title {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.music-status {
  color: rgba(255,255,255,0.8);
  font-size: 0.9rem;
}

/* RSVP */
.rsvp-container {
  background: rgba(255,255,255,0.05);
  padding: 2rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.rsvp-container h2 {
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.rsvp-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.rsvp-button {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rsvp-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.wishes-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 10px;
  background: rgba(255,255,255,0.05);
  color: white;
  font-size: 1rem;
  margin-bottom: 1rem;
  resize: vertical;
  font-family: inherit;
}

.wishes-input::placeholder {
  color: rgba(255,255,255,0.6);
}

.submit-wishes {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: all 0.3s ease;
}

.submit-wishes:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102,126,234,0.4);
}

/* Footer */
.template-footer {
  width: 100%;
  padding: 2rem 0;
  text-align: center;
  position: relative;
  margin-top: 3rem;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content p {
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content h1 {
    font-size: 2rem;
  }
  
  .couple-grid {
    grid-template-columns: 1fr;
  }
  
  .gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .rsvp-buttons {
    flex-direction: column;
  }
  
  .template-main {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .header-content h1 {
    font-size: 1.5rem;
  }
  
  .countdown-time {
    font-size: 1.5rem;
  }
  
  .couple-photo {
    width: 120px;
    height: 120px;
  }
}
</style>