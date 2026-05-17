/**
 * Image helpers for lazy loading and CDN-aware URLs.
 *
 * Set `PUBLIC_IMAGE_CDN_BASE` (e.g. `https://cdn.example.com` or a Cloudflare
 * Images / R2 URL) to rewrite `/uploads/...` paths to a CDN. If unset, paths
 * are returned untouched so local development continues to work.
 *
 * Usage in templates:
 *   <img use:lazyImage={src} alt="..." />
 *   or
 *   <img src={cdnUrl(src)} loading="lazy" decoding="async" />
 */

const CDN_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_IMAGE_CDN_BASE) ||
	(typeof process !== 'undefined' && process.env?.PUBLIC_IMAGE_CDN_BASE) ||
	'';

/**
 * Rewrite an upload path to the configured CDN, or return as-is if no CDN
 * is configured / the URL is absolute / the URL is a data/blob URL.
 */
export function cdnUrl(src: string | null | undefined): string {
	if (!src) return '';
	if (src.startsWith('http://') || src.startsWith('https://')) return src;
	if (src.startsWith('data:') || src.startsWith('blob:')) return src;
	if (!CDN_BASE) return src;
	if (!src.startsWith('/')) return `${CDN_BASE}/${src}`;
	return `${CDN_BASE}${src}`;
}

/**
 * Svelte action: enables IntersectionObserver-driven lazy loading for an <img>
 * element. The element should have a `data-src` attribute matching the actual
 * source. While off-screen the element keeps a transparent placeholder.
 *
 * The action is a no-op (and falls back to the native `loading="lazy"` already
 * set by the consumer) on browsers that don't support IntersectionObserver.
 */
export function lazyImage(node: HTMLImageElement, src: string) {
	if (typeof window === 'undefined') return {};

	let observer: IntersectionObserver | null = null;
	const placeholder =
		'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="%23eee"/></svg>';

	function load(target: HTMLImageElement, value: string) {
		const finalSrc = cdnUrl(value);
		// Use `decoding="async"` to avoid blocking the main thread during paint.
		target.decoding = 'async';
		target.loading = 'lazy';
		target.src = finalSrc;
	}

	if ('IntersectionObserver' in window) {
		node.src = placeholder;
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						load(node, src);
						observer?.disconnect();
					}
				}
			},
			{ rootMargin: '200px' }
		);
		observer.observe(node);
	} else {
		load(node, src);
	}

	return {
		update(newSrc: string) {
			src = newSrc;
			load(node, src);
		},
		destroy() {
			observer?.disconnect();
		}
	};
}
