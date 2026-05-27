import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 3003,
		host: '0.0.0.0',
		allowedHosts: ['nikahin.lockbit.my.id', 'lockbit.my.id'],
		watch: {
			ignored: ['**/data/**']
		}
	}
});
