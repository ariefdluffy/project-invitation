import crypto from 'crypto';

export function generateRandomPassword(length: number = 10): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
	let password = '';
	const randomBytes = crypto.randomBytes(length);

	for (let i = 0; i < length; i++) {
		password += chars[randomBytes[i] % chars.length];
	}

	return password;
}
