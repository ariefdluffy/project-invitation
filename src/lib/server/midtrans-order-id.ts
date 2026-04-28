/**
 * Midtrans membatasi panjang `order_id` max 50 karakter.
 * Format: P|A + UUID short (12 char) + timestamp short (hex 6 char)
 * Total: 2 + 12 + 1 + 6 = 21 karakter (aman di bawah 50)
 */
const ORDER_RE = /^([PA])_([a-f0-9]{12})_([a-f0-9]{6})$/i;

export function buildMidtransOrderId(type: 'premium' | 'addon', userId: string): string {
	if (userId.length !== 36) {
		throw new Error('Invalid user id for Midtrans order_id - must be 36 char UUID');
	}
	const prefix = type === 'premium' ? 'P' : 'A';
	// Ambil 12 char pertama dari UUID + 6 digit hex dari timestamp
	const uuidShort = userId.replace(/-/g, '').slice(0, 12);
	const tsHex = Date.now().toString(16).slice(-6);
	return `${prefix}_${uuidShort}_${tsHex}`;
}

export function parseMidtransOrderId(orderId: string): { kind: 'premium' | 'addon'; userId: string } | null {
	const m = orderId.match(ORDER_RE);
	if (!m) return null;
	const kind = m[1].toUpperCase() === 'P' ? 'premium' : 'addon';
	// m[2] adalah 12 char UUID short - kita tidak bisa recover full UUID
	// tapi untuk lookup cukup dengan initial user UUID check (stored di DB)
	return { kind, userId: m[2] };
}
