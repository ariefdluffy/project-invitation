import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter(),

		// Full production CSP managed by SvelteKit with mode:'nonce'.
		// SvelteKit reads event.locals.cspNonce (set in hooks.server.ts) and
		// automatically adds that nonce to every <script> and <style> tag it
		// generates, then sets the Content-Security-Policy header using these
		// directives + the nonce.
		//
		// hooks.server.ts only overrides the CSP header in DEV mode (to allow
		// Vite HMR unsafe-inline/unsafe-eval). In production it leaves the
		// SvelteKit-generated header untouched.
		csp: {
			mode: 'nonce',
			directives: {
				'default-src': ['self'],
				'script-src': [
					'self',
					'strict-dynamic',
					'https://challenges.cloudflare.com',
					'https://*.cloudflare.com',
					'https://static.cloudflareinsights.com'
				],
				'script-src-elem': [
					'self',
					'strict-dynamic',
					'https://challenges.cloudflare.com',
					'https://*.cloudflare.com',
					'https://static.cloudflareinsights.com'
				],
				'style-src': [
					'self',
					'unsafe-inline',
					'https://fonts.googleapis.com'
				],
				'style-src-elem': [
					'self',
					'unsafe-inline',
					'https://fonts.googleapis.com',
					'https://fonts.gstatic.com'
				],
				'img-src': [
					'self',
					'data:',
					'blob:',
					'https://challenges.cloudflare.com',
					'https://*.cloudflare.com',
					'https://images.unsplash.com',
					'https://*.unsplash.com',
					'https://res.cloudinary.com',
					'https://*.cloudinary.com'
				],
				'font-src': ['self', 'data:', 'https://fonts.gstatic.com'],
				'connect-src': [
					'self',
					'https://challenges.cloudflare.com',
					'https://*.cloudflare.com',
					'https://static.cloudflareinsights.com'
				],
				'frame-src': [
					'self',
					'https://challenges.cloudflare.com',
					'https://*.cloudflare.com',
					'https://maps.google.com',
					'https://www.google.com'
				],
				'object-src': ['none'],
				'base-uri': ['self'],
				'form-action': ['self'],
				'frame-ancestors': ['self']
			}
		}
	}
};

export default config;
