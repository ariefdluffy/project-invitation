import { getDb } from './db';
import { v4 as uuidv4 } from 'uuid';

export interface PromoCode {
	id: string;
	code: string;
	discount_percent: number;
	discount_fixed: number;
	max_uses: number;
	used_count: number;
	package_id: string | null; // null = all packages
	expires_at: string | null;
	is_active: number;
	created_at: string;
}

export async function getPromoCodes(): Promise<PromoCode[]> {
	const db = await getDb();
	const [rows] = await db.execute('SELECT * FROM promo_codes ORDER BY created_at DESC');
	return rows as PromoCode[];
}

export async function getPromoCodeByCode(code: string): Promise<PromoCode | null> {
	const db = await getDb();
	const [rows] = await db.execute(
		'SELECT * FROM promo_codes WHERE code = ? AND is_active = 1',
		[code.toUpperCase()]
	);
	const codes = rows as PromoCode[];
	if (codes.length === 0) return null;
	const promo = codes[0];

	// Check expiry
	if (promo.expires_at && new Date(promo.expires_at) < new Date()) return null;

	// Check max uses
	if (promo.max_uses > 0 && promo.used_count >= promo.max_uses) return null;

	return promo;
}

export async function createPromoCode(data: {
	code: string;
	discount_percent?: number;
	discount_fixed?: number;
	max_uses?: number;
	package_id?: string;
	expires_at?: string;
}): Promise<void> {
	const db = await getDb();
	const id = uuidv4();
	await db.execute(
		`INSERT INTO promo_codes (id, code, discount_percent, discount_fixed, max_uses, package_id, expires_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?)`,
		[id, data.code.toUpperCase(), data.discount_percent || 0, data.discount_fixed || 0,
		 data.max_uses || 0, data.package_id || null, data.expires_at || null]
	);
}

export async function incrementPromoCodeUsage(code: string): Promise<void> {
	const db = await getDb();
	await db.execute('UPDATE promo_codes SET used_count = used_count + 1 WHERE code = ?', [code]);
}

export async function deletePromoCode(id: string): Promise<void> {
	const db = await getDb();
	await db.execute('DELETE FROM promo_codes WHERE id = ?', [id]);
}

export async function ensurePromoCodesTable(): Promise<void> {
	const db = await getDb();
	try {
		await db.execute(`
			CREATE TABLE IF NOT EXISTS promo_codes (
				id VARCHAR(36) PRIMARY KEY,
				code VARCHAR(50) UNIQUE NOT NULL,
				discount_percent INT DEFAULT 0,
				discount_fixed INT DEFAULT 0,
				max_uses INT DEFAULT 0,
				used_count INT DEFAULT 0,
				package_id VARCHAR(36) NULL,
				expires_at DATETIME NULL,
				is_active TINYINT DEFAULT 1,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`);
	} catch (err: any) {
		if (!err.message?.includes('already exists')) throw err;
	}
}
