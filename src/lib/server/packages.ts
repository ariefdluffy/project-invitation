import { getDb } from './db';

export interface Package {
	id: string;
	name: string;
	slug: string;
	description: string;
	price: number;
	invitation_limit: number;
	guest_limit: number;
	template_quota: number;
	duration_days: number | null; // null = lifetime
	is_active: number;
	sort_order: number;
	features: string; // JSON array of feature strings
	created_at: string;
}

export const DEFAULT_PACKAGES = [
	{
		id: 'free',
		name: 'Gratis',
		slug: 'free',
		description: 'Coba buat undangan gratis',
		price: 0,
		invitation_limit: 1,
		guest_limit: 50,
		template_quota: 3,
		duration_days: null,
		is_active: 1,
		sort_order: 1,
		features: JSON.stringify([
			'1 undangan aktif',
			'50 tamu per undangan',
			'3 template tersedia',
			'RSVP online',
			'Ucapan tamu'
		])
	},
	{
		id: 'premium',
		name: 'Premium',
		slug: 'premium',
		description: 'Undangan premium tanpa batas',
		price: 149000,
		invitation_limit: 3,
		guest_limit: 500,
		template_quota: 10,
		duration_days: null,
		is_active: 1,
		sort_order: 2,
		features: JSON.stringify([
			'3 undangan aktif',
			'500 tamu per undangan',
			'Semua template',
			'RSVP online',
			'Upload foto & galeri',
			'Midtrans payment',
			'Prioritas support'
		])
	},
	{
		id: 'pro',
		name: 'Pro',
		slug: 'pro',
		description: 'Untuk wedding organizer & bisnis',
		price: 349000,
		invitation_limit: 10,
		guest_limit: 2000,
		template_quota: 30,
		duration_days: null,
		is_active: 1,
		sort_order: 3,
		features: JSON.stringify([
			'10 undangan aktif',
			'2000 tamu per undangan',
			'Semua template',
			'RSVP online',
			'Upload foto & galeri',
			'Midtrans payment',
			'Analytics tamu',
			'Import tamu CSV',
			'White-label'
		])
	}
];

export async function getPackages(): Promise<Package[]> {
	const db = await getDb();
	const [rows] = await db.execute(
		'SELECT * FROM packages WHERE is_active = 1 ORDER BY sort_order ASC'
	);
	return rows as Package[];
}

export async function getPackageById(id: string): Promise<Package | null> {
	const db = await getDb();
	const [rows] = await db.execute('SELECT * FROM packages WHERE id = ?', [id]);
	const pkg = (rows as Package[])[0];
	return pkg || null;
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
	const db = await getDb();
	const [rows] = await db.execute('SELECT * FROM packages WHERE slug = ? AND is_active = 1', [slug]);
	const pkg = (rows as Package[])[0];
	return pkg || null;
}

export async function seedPackages(): Promise<void> {
	const db = await getDb();
	const existing = await getPackages();
	if (existing.length > 0) return;

	for (const pkg of DEFAULT_PACKAGES) {
		await db.execute(
			`INSERT INTO packages (id, name, slug, description, price, invitation_limit, guest_limit, template_quota, duration_days, is_active, sort_order, features)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[pkg.id, pkg.name, pkg.slug, pkg.description, pkg.price, pkg.invitation_limit,
			 pkg.guest_limit, pkg.template_quota, pkg.duration_days, pkg.is_active, pkg.sort_order, pkg.features]
		);
	}
	console.log('[Packages] Seeded default packages');
}

export async function ensurePackagesTable(): Promise<void> {
	const db = await getDb();
	try {
		await db.execute(`
			CREATE TABLE IF NOT EXISTS packages (
				id VARCHAR(36) PRIMARY KEY,
				name VARCHAR(100) NOT NULL,
				slug VARCHAR(50) UNIQUE NOT NULL,
				description TEXT,
				price INT NOT NULL DEFAULT 0,
				invitation_limit INT NOT NULL DEFAULT 1,
				guest_limit INT NOT NULL DEFAULT 50,
				template_quota INT NOT NULL DEFAULT 3,
				duration_days INT NULL,
				is_active TINYINT DEFAULT 1,
				sort_order INT DEFAULT 0,
				features TEXT,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`);
	} catch (err: any) {
		if (!err.message?.includes('already exists')) throw err;
	}
}
