import bcryptjs from 'bcryptjs';

/**
 * Password security configuration.
 * BCRYPT_COST: 12 = ~250ms per hash on modern hardware (OWASP 2024+ recommend min 10-12).
 * MIN_LENGTH: 8 (OWASP recommend 8+, NIST 800-63B allows down to 8).
 */
export const BCRYPT_COST = 12;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128; // Prevent DoS via long passwords

export interface PasswordValidation {
	valid: boolean;
	error?: string;
}

/**
 * Validate password meets security policy.
 * Rules:
 * - Length 8-128
 * - Contains at least one letter
 * - Contains at least one number
 * - Not in common-password blacklist
 */
export function validatePassword(password: string): PasswordValidation {
	if (!password || typeof password !== 'string') {
		return { valid: false, error: 'Password harus diisi.' };
	}

	if (password.length < PASSWORD_MIN_LENGTH) {
		return {
			valid: false,
			error: `Password minimal ${PASSWORD_MIN_LENGTH} karakter.`
		};
	}

	if (password.length > PASSWORD_MAX_LENGTH) {
		return {
			valid: false,
			error: `Password maksimal ${PASSWORD_MAX_LENGTH} karakter.`
		};
	}

	if (!/[A-Za-z]/.test(password)) {
		return { valid: false, error: 'Password harus mengandung minimal 1 huruf.' };
	}

	if (!/[0-9]/.test(password)) {
		return { valid: false, error: 'Password harus mengandung minimal 1 angka.' };
	}

	const lower = password.toLowerCase();
	if (COMMON_PASSWORDS.has(lower)) {
		return {
			valid: false,
			error: 'Password terlalu umum. Gunakan kombinasi yang lebih unik.'
		};
	}

	return { valid: true };
}

/**
 * Hash password with the configured bcrypt cost factor.
 */
export function hashPassword(password: string): string {
	return bcryptjs.hashSync(password, BCRYPT_COST);
}

/**
 * Verify password against a bcrypt hash.
 */
export function verifyPassword(password: string, hash: string): boolean {
	try {
		return bcryptjs.compareSync(password, hash);
	} catch {
		return false;
	}
}

/**
 * Check if a hash needs rehashing (cost factor lower than current target).
 * Use this on login to migrate old hashes transparently.
 */
export function needsRehash(hash: string): boolean {
	try {
		// bcrypt hash format: $2a$<cost>$<rest>
		const parts = hash.split('$');
		if (parts.length < 4) return true;
		const cost = parseInt(parts[2], 10);
		if (Number.isNaN(cost)) return true;
		return cost < BCRYPT_COST;
	} catch {
		return true;
	}
}

/**
 * Small blacklist of the most common passwords.
 * For production, consider integrating HIBP (haveibeenpwned) API instead.
 */
const COMMON_PASSWORDS = new Set([
	'password',
	'password1',
	'password123',
	'12345678',
	'123456789',
	'1234567890',
	'qwerty123',
	'qwertyuiop',
	'abc12345',
	'111111aa',
	'admin123',
	'admin1234',
	'letmein1',
	'welcome1',
	'welcome123',
	'iloveyou1',
	'monkey123',
	'dragon123',
	'master123',
	'football1',
	'baseball1',
	'sunshine1',
	'princess1',
	'shadow123',
	'superman1',
	'batman123',
	'trustno1',
	'passw0rd',
	'p@ssw0rd',
	'p@ssword1'
]);
