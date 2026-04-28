<style>
	:global(.layout-modern .hero-box) { border-radius: 0; border: 4px solid var(--p-col); background: white; }
	:global(.layout-modern .names) { font-family: "Montserrat", sans-serif !important; text-transform: uppercase; letter-spacing: 5px; font-weight: 900; }
	:global(.layout-modern .couple-card) { border-radius: 0; box-shadow: 10px 10px 0 var(--s-col); }
	:global(.layout-modern .event-card) { border: 2px solid var(--p-col); border-radius: 0; }

	:global(.layout-romantic .hero-box) { border-radius: 100px 100px 0 0; border: none; background: rgba(255,255,255,0.8); }
	:global(.layout-romantic .names) { font-family: "Great Vibes", cursive !important; font-size: 4rem; }
	:global(.layout-romantic .couple-card) { border-radius: 50% 50% 0 0; overflow: hidden; }
	:global(.layout-romantic .section-heading .title::after) { content: "\1F338"; margin-left: 10px; }

	:global(.layout-luxury .invitation-container),
	:global(.layout-royal .invitation-container) { background: #000; color: #eee; }
	:global(.layout-luxury .hero-box),
	:global(.layout-royal .hero-box) { border: 1px solid var(--s-col); background: linear-gradient(to bottom, #1a1a1a, #000); }
	:global(.layout-luxury .names),
	:global(.layout-royal .names) { font-family: "Playfair Display", serif !important; letter-spacing: 2px; }
	:global(.layout-luxury .couple-card),
	:global(.layout-royal .couple-card) { border: 1px solid var(--s-col); background: #111; color: white; }
	:global(.layout-luxury .event-card),
	:global(.layout-royal .event-card) { background: #1a1a1a; border-top: 3px solid var(--s-col); }

	:global(.layout-vintage .invitation-container) { background: #f4ece1; }
	:global(.layout-vintage .hero-box) { background: #fff; border: 2px dashed #8d6e63; border-radius: 8px; }
	:global(.layout-vintage .names) { font-family: "Special Elite", cursive !important; color: #5d4037; }
	:global(.layout-vintage .couple-card) { background: #fff; border: 1px solid #d7ccc8; transform: rotate(-2deg); }
	:global(.layout-vintage .event-card) { background: #fff; border-bottom: 5px solid #8d6e63; }

	:global(.layout-celestial .invitation-container) { background: #0f172a; color: #fff; }
	:global(.layout-celestial .hero-box) { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(148, 163, 184, 0.3); border-radius: 50%; width: 350px; height: 350px; display: flex; flex-direction: column; justify-content: center; margin: 0 auto; }
	:global(.layout-celestial .names) { font-family: "Cinzel Decorative", serif !important; font-size: 2.5rem; text-shadow: 0 0 10px rgba(255,255,255,0.5); }
	:global(.layout-celestial .couple-card) { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border-radius: 20px; }

	:global(.layout-tropical .invitation-container) { background: #f0fdfa; }
	:global(.layout-tropical .hero-box) { border-left: 8px solid var(--p-col); background: white; padding-left: 2rem; }
	:global(.layout-tropical .names) { font-family: "Outfit", sans-serif !important; color: var(--p-col); font-weight: 800; }
	:global(.layout-tropical .couple-card) { border-radius: 30px; background: white; box-shadow: 0 10px 30px rgba(6, 95, 70, 0.1); }
</style>
