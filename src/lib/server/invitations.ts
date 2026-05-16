import { getDb } from './db';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export interface Invitation {
	id: string;
	user_id: string;
	template_id: string;
	slug: string;
	groom_name: string;
	groom_full_name: string;
	groom_parents: string;
	groom_instagram: string;
	groom_photo: string;
	bride_name: string;
	bride_full_name: string;
	bride_parents: string;
	bride_instagram: string;
	bride_photo: string;
	quote: string;
	quote_source: string;
	akad_date: string;
	akad_time: string;
	resepsi_date: string;
	resepsi_time: string;
	venue_name: string;
	venue_address: string;
	venue_map_url: string;
	love_story: string;
	bank_accounts: string;
	dress_code_colors: string;
	music_url: string;
	background_image: string;
	gallery_images: string;
	respect_person: string | null;
	is_published: number;
	created_at: string;
	updated_at: string;
}

export interface Guest {
	id: string;
	invitation_id: string;
	name: string;
	slug: string;
	is_attending: number;
	num_guests: number;
	has_responded: number;
	created_at: string;
}

export interface Wish {
	id: string;
	invitation_id: string;
	guest_name: string;
	message: string;
	is_attending: string;
	created_at: string;
}

export async function createInvitation(data: Partial<Invitation> & { user_id: string; template_id: string; slug: string; groom_name: string; bride_name: string }): Promise<Invitation> {
	const db = await getDb();
	const id = uuidv4();

	await db.execute(
		`INSERT INTO invitations (id, user_id, template_id, slug, groom_name, groom_full_name, groom_parents, groom_instagram, groom_photo, bride_name, bride_full_name, bride_parents, bride_instagram, bride_photo, quote, quote_source, akad_date, akad_time, resepsi_date, resepsi_time, venue_name, venue_address, venue_map_url, love_story, respect_person, bank_accounts, dress_code_colors, music_url, background_image, gallery_images)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			id, data.user_id, data.template_id, data.slug,
			data.groom_name, data.groom_full_name || '', data.groom_parents || '', data.groom_instagram || '', data.groom_photo || '',
			data.bride_name, data.bride_full_name || '', data.bride_parents || '', data.bride_instagram || '', data.bride_photo || '',
			data.quote || '', data.quote_source || '',
			data.akad_date || '', data.akad_time || '', data.resepsi_date || '', data.resepsi_time || '',
			data.venue_name || '', data.venue_address || '', data.venue_map_url || '',
			data.love_story || '', data.respect_person || null, data.bank_accounts || '[]', data.dress_code_colors || '[]',
			data.music_url || '', data.background_image || '', data.gallery_images || ''
		]
	);

	return (await getInvitationById(id)) as Invitation;
}

export async function updateInvitation(id: string, data: Partial<Invitation>): Promise<Invitation | null> {
	const db = await getDb();
	const fields: string[] = [];
	const values: any[] = [];

	const allowedFields = [
		'template_id', 'slug', 'groom_name', 'groom_full_name', 'groom_parents', 'groom_instagram', 'groom_photo',
		'bride_name', 'bride_full_name', 'bride_parents', 'bride_instagram', 'bride_photo',
		'quote', 'quote_source', 'akad_date', 'akad_time', 'resepsi_date', 'resepsi_time',
		'venue_name', 'venue_address', 'venue_map_url', 'love_story', 'respect_person',
		'bank_accounts', 'dress_code_colors', 'music_url', 'background_image', 'gallery_images', 'is_published', 'custom_content'
	];

	const templates = await getTemplates();
	// Validasi template_id jika ada dalam data.
    // HAPUS template_id dari 'data' jika tidak valid AGAR TIDAK DI-UPDATE,
    // namun kita perlu memastikan 'fields' dan 'values' array tidak terisi template_id jika dihapus.

	if (data.template_id) {
		const templateExists = templates.some(t => t.id === data.template_id);
		if (!templateExists) {
			console.warn(`Template ID ${data.template_id} tidak ditemukan di database, menghapus dari data update.`);
			delete data.template_id;
		}
	}

	for (const field of allowedFields) {
		if (field in data) {
			fields.push(`${field} = ?`);
			values.push((data as Record<string, unknown>)[field]);
		}
	}
	fields.push('updated_at = CURRENT_TIMESTAMP');
	values.push(id);

	await db.execute(`UPDATE invitations SET ${fields.join(', ')} WHERE id = ?`, values);

	return getInvitationById(id);
}

export async function getInvitationById(id: string): Promise<Invitation | null> {
	const db = await getDb();
	const [rows] = await db.execute('SELECT * FROM invitations WHERE id = ?', [id]);
	const invs = rows as Invitation[];
	return invs.length > 0 ? invs[0] : null;
}

export async function getInvitationBySlug(slug: string): Promise<Invitation | null> {
	const db = await getDb();
	const [rows] = await db.execute('SELECT * FROM invitations WHERE slug = ?', [slug]);
	const invs = rows as Invitation[];
	return invs.length > 0 ? invs[0] : null;
}

export async function getInvitationsByUser(userId: string): Promise<Invitation[]> {
	const db = await getDb();
	const [rows] = await db.execute('SELECT * FROM invitations WHERE user_id = ? ORDER BY created_at DESC', [userId]);
	return rows as Invitation[];
}

export async function getAllInvitations(): Promise<Invitation[]> {
	const db = await getDb();
	const [rows] = await db.execute('SELECT * FROM invitations ORDER BY created_at DESC');
	return rows as Invitation[];
}

export async function deleteInvitation(id: string): Promise<void> {
	const db = await getDb();
	await db.execute('DELETE FROM invitations WHERE id = ?', [id]);
}

export async function duplicateInvitation(id: string): Promise<string> {
	const db = await getDb();
	const original = await getInvitationById(id);
	if (!original) throw new Error('Undangan asli tidak ditemukan');

	const newId = uuidv4();
	const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;

	await db.execute(
		`INSERT INTO invitations (
			id, user_id, template_id, slug,
			groom_name, groom_full_name, groom_parents, groom_instagram, groom_photo,
			bride_name, bride_full_name, bride_parents, bride_instagram, bride_photo,
			quote, quote_source, akad_date, akad_time, resepsi_date, resepsi_time,
			venue_name, venue_address, venue_map_url, love_story, bank_accounts,
			dress_code_colors, music_url, background_image, gallery_images, respect_person
		) SELECT
			?, user_id, template_id, ?,
			groom_name, groom_full_name, groom_parents, groom_instagram, groom_photo,
			bride_name, bride_full_name, bride_parents, bride_instagram, bride_photo,
			quote, quote_source, akad_date, akad_time, resepsi_date, resepsi_time,
			venue_name, venue_address, venue_map_url, love_story, bank_accounts,
			dress_code_colors, music_url, background_image, gallery_images, respect_person
		FROM invitations WHERE id = ?`,
		[newId, newSlug, id]
	);

	return newId;
}

// Guest operations
export async function addGuest(invitationId: string, name: string): Promise<Guest> {
	const db = await getDb();

	// Get invitation owner
	const [invRows] = await db.execute('SELECT user_id FROM invitations WHERE id = ?', [invitationId]);
	const inv = (invRows as any[])[0];
	if (!inv) throw new Error('Undangan tidak ditemukan');

	// Get user limit
	const [userRows] = await db.execute('SELECT guest_limit, role FROM users WHERE id = ?', [inv.user_id]);
	const user = (userRows as any[])[0];
	if (!user) throw new Error('User tidak ditemukan');

	// Count TOTAL guests of this user across all their invitations
	const [countRows] = await db.execute(`
		SELECT COUNT(g.id) as count
		FROM guests g
		JOIN invitations i ON g.invitation_id = i.id
		WHERE i.user_id = ?
	`, [inv.user_id]);
	const currentCount = (countRows as any[])[0].count;

	if (user.role !== 'admin' && currentCount >= user.guest_limit) {
		throw new Error(`Total limit tamu akun Anda tercapai (${user.guest_limit}). Silakan beli Add-on untuk menambah kuota.`);
	}

	const id = uuidv4();
	const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

	await db.execute(
		'INSERT INTO guests (id, invitation_id, name, slug) VALUES (?, ?, ?, ?)',
		[id, invitationId, name, slug]
	);

	return { id, invitation_id: invitationId, name, slug, is_attending: 0, num_guests: 1, has_responded: 0, created_at: new Date().toISOString() };
}

export async function getGuestsByInvitation(invitationId: string): Promise<Guest[]> {
	const db = await getDb();
	const [rows] = await db.execute('SELECT * FROM guests WHERE invitation_id = ? ORDER BY created_at DESC', [invitationId]);
	return rows as Guest[];
}

export async function deleteGuest(id: string): Promise<void> {
	const db = await getDb();
	await db.execute('DELETE FROM guests WHERE id = ?', [id]);
}

// Wishes operations
export async function addWish(invitationId: string, guestName: string, message: string, isAttending: string = 'hadir'): Promise<Wish> {
	const db = await getDb();
	const id = uuidv4();

	await db.execute(
		'INSERT INTO wishes (id, invitation_id, guest_name, message, is_attending) VALUES (?, ?, ?, ?, ?)',
		[id, invitationId, guestName, message, isAttending]
	);

	// Update the guest's RSVP status if they exist
	const attendingStatus = isAttending === 'hadir' ? 1 : 0;
	await db.execute(
		'UPDATE guests SET has_responded = 1, is_attending = ? WHERE invitation_id = ? AND name = ?',
		[attendingStatus, invitationId, guestName]
	);

	return { id, invitation_id: invitationId, guest_name: guestName, message, is_attending: isAttending, created_at: new Date().toISOString() };
}

export async function getWishesByInvitation(invitationId: string): Promise<Wish[]> {
	const db = await getDb();
	const [rows] = await db.execute('SELECT * FROM wishes WHERE invitation_id = ? ORDER BY created_at DESC', [invitationId]);
	return rows as Wish[];
}

export async function deleteWish(id: string): Promise<void> {
	const db = await getDb();
	await db.execute('DELETE FROM wishes WHERE id = ?', [id]);
}

// Template operations
export interface Template {
	id: string;
	name: string;
	slug?: string;
	category: string;
	thumbnail: string;
	description: string;
	primary_color?: string;
	secondary_color?: string;
	accent_color?: string;
	font_family?: string;
	layout_style?: string;
	defaultContent: Record<string, any>;
}

const TEMPLATES_DIR = path.resolve('static/templates');

export async function getTemplates(): Promise<Template[]> {
	if (!fs.existsSync(TEMPLATES_DIR)) {
		console.warn('TEMPLATES_DIR does not exist:', TEMPLATES_DIR);
		return [];
	}

	const templates: Template[] = [];
	try {
		const categories = fs.readdirSync(TEMPLATES_DIR);

		for (const cat of categories) {
			const catPath = path.join(TEMPLATES_DIR, cat);
			if (fs.statSync(catPath).isDirectory()) {
				const files = fs.readdirSync(catPath).filter(f => f.endsWith('.json'));
				for (const file of files) {
					try {
						const content = fs.readFileSync(path.join(catPath, file), 'utf-8');
						const tmpl = JSON.parse(content);
						templates.push({
							...tmpl,
							category: cat
						});
					} catch (err) {
						console.error(`Error loading template ${file}:`, err);
					}
				}
			}
		}
	} catch (err) {
		console.error('Error reading templates directory:', err);
	}
	return templates;
}

export async function getTemplateById(id: string): Promise<Template | null> {
	const all = await getTemplates();
	const found = all.find(t => t.id === id) || null;
	if (!found) {
		console.warn(`Template with id ${id} not found, falling back to javanese-elegance`);
		return all.find(t => t.id === 'javanese-elegance') || null;
	}
	return found;
}

export async function getTemplateBySlug(slug: string): Promise<Template | null> {
	const all = await getTemplates();
	return all.find(t => t.id === slug) || null;
}

export async function fixMusicLinks(): Promise<void> {
	const db = await getDb();
	const newMusic = 'https://server14.mp3quran.net/khalf/004.mp3';

	try {
		// Update settings
		await db.execute("UPDATE settings SET value = ? WHERE `key` = 'default_music_url'", [newMusic]);

		// Update existing invitations to the new default
		await db.execute("UPDATE invitations SET music_url = ?", [newMusic]);

		console.log('Music links updated to Murottal.');
	} catch (err) {
		console.error('Error fixing music links:', err);
	}
}

export async function ensureRespectColumn(): Promise<void> {
	const db = await getDb();

	// Also fix music links during migration
	await fixMusicLinks();

	try {
		const [rows] = await db.execute("SHOW COLUMNS FROM invitations LIKE 'respect_person'");
		if ((rows as any[]).length === 0) {
			console.log('Adding respect_person column to invitations table...');
			await db.execute("ALTER TABLE invitations ADD COLUMN respect_person VARCHAR(255) DEFAULT NULL AFTER love_story");
		}
	} catch (err) {
		console.error('Migration Error (respect_person):', err);
	}
}

import { ensureGuestLimitColumn } from './users';

export async function ensureTemplateCategoryColumn(): Promise<void> {
	const db = await getDb();
	try {
		const [rows] = await db.execute("SHOW COLUMNS FROM templates LIKE 'category'");
		if ((rows as any[]).length === 0) {
			console.log('[Server] Adding templates.category column...');
			await db.execute(
				"ALTER TABLE templates ADD COLUMN category VARCHAR(30) NOT NULL DEFAULT 'wedding' AFTER layout_style"
			);
		}
	} catch (err) {
		console.error('Migration Error (templates.category):', err);
	}
}

export async function seedTemplates(): Promise<void> {
	const db = await getDb();

	// Ensure schema is updated
	await ensureRespectColumn();
	await ensureGuestLimitColumn();
	await ensureTemplateCategoryColumn();

	// Get templates from filesystem
	const fsTemplates = await getTemplates();
	if (fsTemplates.length === 0) {
		console.log('[Server] No templates found in filesystem. Seeding process skipped.');
		return;
	}

	console.log(`[Server] Found ${fsTemplates.length} templates in filesystem. Seeding to database...`);

	// Clear old templates to fix broken thumbnails and naming conflicts
	console.log('[Server] Clearing and re-seeding templates...');
	await db.execute("SET FOREIGN_KEY_CHECKS = 0;");
	await db.execute("TRUNCATE TABLE templates;");
	await db.execute("SET FOREIGN_KEY_CHECKS = 1;");

	const insertQuery = `
		INSERT INTO templates (id, name, slug, description, thumbnail, primary_color, secondary_color, accent_color, font_family, layout_style, category)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
	`;

	for (const tmpl of fsTemplates) {
		try {
			await db.execute(insertQuery, [
				tmpl.id,
				tmpl.name,
				tmpl.id, // Using id as slug for consistency
				tmpl.description || '',
				tmpl.thumbnail || '',
				tmpl.primary_color || '#D4A574',
				tmpl.secondary_color || '#8B6F4E',
				tmpl.accent_color || '#F5E6D3',
				tmpl.font_family || 'Playfair Display',
				tmpl.layout_style || 'classic',
				tmpl.category
			]);
		} catch (error) {
			console.error(`[Server] Error seeding template ${tmpl.id}:`, error);
		}
	}

	console.log('[Server] Template seeding completed.');
}

export async function seedSettings(): Promise<void> {
	const db = await getDb();
	const defaultSettings = [
		{ key: 'app_name', value: 'Lembar Moment' },
		{ key: 'premium_price', value: '39000' },
		{ key: 'addon_guest_price', value: '19000' },
		{ key: 'addon_guest_quantity', value: '50' },
		{ key: 'midtrans_server_key', value: '' },
		{ key: 'midtrans_client_key', value: '' },
		{ key: 'midtrans_is_production', value: '0' },
		{ key: 'default_music_url', value: 'https://server14.mp3quran.net/khalf/004.mp3' }
	];

	for (const s of defaultSettings) {
		await db.execute(
			'INSERT IGNORE INTO settings (`key`, value) VALUES (?, ?)',
			[s.key, s.value]
		);
	}
}

export async function seedAdmin(): Promise<void> {
	const db = await getDb();
	const [rows] = await db.execute("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
	const count = (rows as any)[0].count;

	if (count > 0) return;

	const { createUser } = await import('./users');
	await createUser('admin', 'admin@wedding.com', 'admin123', 'admin');
}

export async function getGuestStatsByUser(userId: string) {
	const db = await getDb();
	const [rows] = await db.execute(`
		SELECT
			COUNT(g.id) as total,
			SUM(CASE WHEN g.is_attending = 1 THEN 1 ELSE 0 END) as attending,
			SUM(CASE WHEN g.is_attending = 0 AND g.has_responded = 1 THEN 1 ELSE 0 END) as not_attending,
			SUM(CASE WHEN g.has_responded = 0 THEN 1 ELSE 0 END) as no_response
		FROM guests g
		JOIN invitations i ON g.invitation_id = i.id
		WHERE i.user_id = ?
	`, [userId]);

	const stats = (rows as any)[0];
	return {
		total: Number(stats.total || 0),
		attending: Number(stats.attending || 0),
		not_attending: Number(stats.not_attending || 0),
		no_response: Number(stats.no_response || 0)
	};
}
