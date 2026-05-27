/**
 * Simple in-memory rate limiter.
 * WARNING: Per-process state. In PM2 cluster mode, each instance tracks separately.
 * For production with multi-instance, use Redis or external store.
 */

interface RateLimitEntry {
	count: number;
	resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
	if (cleanupTimer) return;
	cleanupTimer = setInterval(() => {
		const now = Date.now();
		for (const [key, entry] of store.entries()) {
			if (entry.resetAt <= now) {
				store.delete(key);
			}
		}
	}, CLEANUP_INTERVAL_MS);
	// Allow process to exit even if timer is active
	if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
		cleanupTimer.unref();
	}
}

export interface RateLimitOptions {
	/** Max requests allowed in the window */
	maxRequests: number;
	/** Window duration in milliseconds */
	windowMs: number;
}

const DEFAULTS: RateLimitOptions = {
	maxRequests: 10,
	windowMs: 60 * 1000 // 1 minute
};

/**
 * Check if a request should be rate limited.
 * Returns `true` if allowed, `false` if rate limited.
 */
export function checkRateLimit(
	key: string,
	options: Partial<RateLimitOptions> = {}
): { allowed: boolean; remaining: number; resetAt: number } {
	startCleanup();

	const config = { ...DEFAULTS, ...options };
	const now = Date.now();
	const entry = store.get(key);

	if (!entry || entry.resetAt <= now) {
		// New window
		const resetAt = now + config.windowMs;
		store.set(key, { count: 1, resetAt });
		return { allowed: true, remaining: config.maxRequests - 1, resetAt };
	}

	if (entry.count >= config.maxRequests) {
		return { allowed: false, remaining: 0, resetAt: entry.resetAt };
	}

	entry.count++;
	return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt };
}

/**
 * Create a rate-limited handler wrapper for form actions.
 * Returns error response object if rate limited, null if allowed.
 */
export function rateLimitAction(key: string, options?: Partial<RateLimitOptions>): { error: string } | null {
	const result = checkRateLimit(key, options);
	if (!result.allowed) {
		return { error: 'Terlalu banyak permintaan. Silakan coba lagi dalam beberapa saat.' };
	}
	return null;
}

/**
 * Get rate limit key for an IP address.
 */
export function ipKey(ip: string, prefix: string = 'rl'): string {
	return `${prefix}:${ip}`;
}
