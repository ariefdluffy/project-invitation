<style>
	:global(.invitation-container) {
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

	:global(.bg-blur-overlay) {
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

	:global(.title),
	:global(.names),
	:global(.cover-title) {
		font-family: var(--f-fam);
		color: var(--p-col);
	}

	:global(.audio-btn) {
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

	:global(.section) {
		padding: 5rem 1.5rem;
		text-align: center;
		position: relative;
		max-width: 800px;
		margin: 0 auto;
		z-index: 1;
	}

	:global(.section-heading) {
		margin-bottom: 3rem;
	}

	:global(.section-heading .title) {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	:global(.section-heading p) {
		font-size: 0.9rem;
		line-height: 1.6;
		opacity: 0.8;
	}

	:global(.btn-primary) {
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

	:global(.btn-primary:hover) {
		opacity: 0.9;
	}

	:global(.reveal) {
		opacity: 0;
		transform: translateY(30px);
		transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	:global(.reveal-visible) {
		opacity: 1;
		transform: translateY(0);
	}

	:global(.reveal.zoom-in) {
		transform: scale(0.9);
	}

	:global(.reveal-visible.zoom-in) {
		transform: scale(1);
	}

	:global(.delay-1) { transition-delay: 0.2s; }
	:global(.delay-2) { transition-delay: 0.4s; }
	:global(.delay-3) { transition-delay: 0.6s; }
</style>
