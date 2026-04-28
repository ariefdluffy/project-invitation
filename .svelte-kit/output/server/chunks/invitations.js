import { t as getDb } from "./db.js";
import { a as ensureGuestLimitColumn } from "./users2.js";
import { v4 } from "uuid";
//#region src/lib/server/invitations.ts
async function createInvitation(data) {
	const db = await getDb();
	const id = v4();
	await db.execute(`INSERT INTO invitations (id, user_id, template_id, slug, groom_name, groom_full_name, groom_parents, groom_instagram, groom_photo, bride_name, bride_full_name, bride_parents, bride_instagram, bride_photo, quote, quote_source, akad_date, akad_time, resepsi_date, resepsi_time, venue_name, venue_address, venue_map_url, love_story, respect_person, bank_accounts, dress_code_colors, music_url, background_image, gallery_images)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
		id,
		data.user_id,
		data.template_id,
		data.slug,
		data.groom_name,
		data.groom_full_name || "",
		data.groom_parents || "",
		data.groom_instagram || "",
		data.groom_photo || "",
		data.bride_name,
		data.bride_full_name || "",
		data.bride_parents || "",
		data.bride_instagram || "",
		data.bride_photo || "",
		data.quote || "",
		data.quote_source || "",
		data.akad_date || "",
		data.akad_time || "",
		data.resepsi_date || "",
		data.resepsi_time || "",
		data.venue_name || "",
		data.venue_address || "",
		data.venue_map_url || "",
		data.love_story || "",
		data.respect_person || null,
		data.bank_accounts || "[]",
		data.dress_code_colors || "[]",
		data.music_url || "",
		data.background_image || "",
		data.gallery_images || ""
	]);
	return await getInvitationById(id);
}
async function updateInvitation(id, data) {
	const db = await getDb();
	const fields = [];
	const values = [];
	for (const field of [
		"template_id",
		"slug",
		"groom_name",
		"groom_full_name",
		"groom_parents",
		"groom_instagram",
		"groom_photo",
		"bride_name",
		"bride_full_name",
		"bride_parents",
		"bride_instagram",
		"bride_photo",
		"quote",
		"quote_source",
		"akad_date",
		"akad_time",
		"resepsi_date",
		"resepsi_time",
		"venue_name",
		"venue_address",
		"venue_map_url",
		"love_story",
		"respect_person",
		"bank_accounts",
		"dress_code_colors",
		"music_url",
		"background_image",
		"gallery_images",
		"is_published"
	]) if (field in data) {
		fields.push(`${field} = ?`);
		values.push(data[field]);
	}
	if (fields.length === 0) return getInvitationById(id);
	fields.push("updated_at = CURRENT_TIMESTAMP");
	values.push(id);
	await db.execute(`UPDATE invitations SET ${fields.join(", ")} WHERE id = ?`, values);
	return getInvitationById(id);
}
async function getInvitationById(id) {
	const [rows] = await (await getDb()).execute("SELECT * FROM invitations WHERE id = ?", [id]);
	const invs = rows;
	return invs.length > 0 ? invs[0] : null;
}
async function getInvitationBySlug(slug) {
	const [rows] = await (await getDb()).execute("SELECT * FROM invitations WHERE slug = ?", [slug]);
	const invs = rows;
	return invs.length > 0 ? invs[0] : null;
}
async function getInvitationsByUser(userId) {
	const [rows] = await (await getDb()).execute("SELECT * FROM invitations WHERE user_id = ? ORDER BY created_at DESC", [userId]);
	return rows;
}
async function getAllInvitations() {
	const [rows] = await (await getDb()).execute("SELECT * FROM invitations ORDER BY created_at DESC");
	return rows;
}
async function deleteInvitation(id) {
	await (await getDb()).execute("DELETE FROM invitations WHERE id = ?", [id]);
}
async function duplicateInvitation(id) {
	const db = await getDb();
	const original = await getInvitationById(id);
	if (!original) throw new Error("Undangan asli tidak ditemukan");
	const newId = v4();
	const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
	await db.execute(`INSERT INTO invitations (
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
		FROM invitations WHERE id = ?`, [
		newId,
		newSlug,
		id
	]);
	return newId;
}
async function addGuest(invitationId, name) {
	const db = await getDb();
	const [invRows] = await db.execute("SELECT user_id FROM invitations WHERE id = ?", [invitationId]);
	const inv = invRows[0];
	if (!inv) throw new Error("Undangan tidak ditemukan");
	const [userRows] = await db.execute("SELECT guest_limit, role FROM users WHERE id = ?", [inv.user_id]);
	const user = userRows[0];
	if (!user) throw new Error("User tidak ditemukan");
	const [countRows] = await db.execute(`
		SELECT COUNT(g.id) as count 
		FROM guests g 
		JOIN invitations i ON g.invitation_id = i.id 
		WHERE i.user_id = ?
	`, [inv.user_id]);
	const currentCount = countRows[0].count;
	if (user.role !== "admin" && currentCount >= user.guest_limit) throw new Error(`Total limit tamu akun Anda tercapai (${user.guest_limit}). Silakan beli Add-on untuk menambah kuota.`);
	const id = v4();
	const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
	await db.execute("INSERT INTO guests (id, invitation_id, name, slug) VALUES (?, ?, ?, ?)", [
		id,
		invitationId,
		name,
		slug
	]);
	return {
		id,
		invitation_id: invitationId,
		name,
		slug,
		is_attending: 0,
		num_guests: 1,
		has_responded: 0,
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	};
}
async function getGuestsByInvitation(invitationId) {
	const [rows] = await (await getDb()).execute("SELECT * FROM guests WHERE invitation_id = ? ORDER BY created_at DESC", [invitationId]);
	return rows;
}
async function deleteGuest(id) {
	await (await getDb()).execute("DELETE FROM guests WHERE id = ?", [id]);
}
async function addWish(invitationId, guestName, message, isAttending = "hadir") {
	const db = await getDb();
	const id = v4();
	await db.execute("INSERT INTO wishes (id, invitation_id, guest_name, message, is_attending) VALUES (?, ?, ?, ?, ?)", [
		id,
		invitationId,
		guestName,
		message,
		isAttending
	]);
	const attendingStatus = isAttending === "hadir" ? 1 : 0;
	await db.execute("UPDATE guests SET has_responded = 1, is_attending = ? WHERE invitation_id = ? AND name = ?", [
		attendingStatus,
		invitationId,
		guestName
	]);
	return {
		id,
		invitation_id: invitationId,
		guest_name: guestName,
		message,
		is_attending: isAttending,
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	};
}
async function getWishesByInvitation(invitationId) {
	const [rows] = await (await getDb()).execute("SELECT * FROM wishes WHERE invitation_id = ? ORDER BY created_at DESC", [invitationId]);
	return rows;
}
function normalizeTemplate(row) {
	return {
		...row,
		category: row.category || "wedding"
	};
}
async function getTemplates() {
	const [rows] = await (await getDb()).execute("SELECT * FROM templates ORDER BY category ASC, created_at ASC");
	return rows.map(normalizeTemplate);
}
async function getTemplateById(id) {
	const [rows] = await (await getDb()).execute("SELECT * FROM templates WHERE id = ?", [id]);
	const templates = rows;
	return templates.length > 0 ? normalizeTemplate(templates[0]) : null;
}
async function fixMusicLinks() {
	const db = await getDb();
	const newMusic = "https://server14.mp3quran.net/khalf/004.mp3";
	try {
		await db.execute("UPDATE settings SET value = ? WHERE `key` = 'default_music_url'", [newMusic]);
		await db.execute("UPDATE invitations SET music_url = ?", [newMusic]);
		console.log("Music links updated to Murottal.");
	} catch (err) {
		console.error("Error fixing music links:", err);
	}
}
async function ensureRespectColumn() {
	const db = await getDb();
	await fixMusicLinks();
	try {
		const [rows] = await db.execute("SHOW COLUMNS FROM invitations LIKE 'respect_person'");
		if (rows.length === 0) {
			console.log("Adding respect_person column to invitations table...");
			await db.execute("ALTER TABLE invitations ADD COLUMN respect_person VARCHAR(255) DEFAULT NULL AFTER love_story");
		}
	} catch (err) {
		console.error("Migration Error (respect_person):", err);
	}
}
async function ensureTemplateCategoryColumn() {
	const db = await getDb();
	try {
		const [rows] = await db.execute("SHOW COLUMNS FROM templates LIKE 'category'");
		if (rows.length === 0) {
			console.log("[Server] Adding templates.category column...");
			await db.execute("ALTER TABLE templates ADD COLUMN category VARCHAR(30) NOT NULL DEFAULT 'wedding' AFTER layout_style");
		}
	} catch (err) {
		console.error("Migration Error (templates.category):", err);
	}
}
async function seedTemplates() {
	const db = await getDb();
	await ensureRespectColumn();
	await ensureGuestLimitColumn();
	await ensureTemplateCategoryColumn();
	console.log("[Server] Clearing and re-seeding templates...");
	await db.execute("SET FOREIGN_KEY_CHECKS = 0;");
	await db.execute("TRUNCATE TABLE templates;");
	await db.execute("SET FOREIGN_KEY_CHECKS = 1;");
	for (const t of [
		{
			id: "tmpl-javanese",
			name: "Javanese Elegance",
			slug: "javanese-elegance",
			description: "Template elegan dengan nuansa budaya Jawa yang indah, ornamen batik, dan warna emas klasik.",
			thumbnail: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=600&q=80",
			primary_color: "#8B6914",
			secondary_color: "#D4A574",
			accent_color: "#FDF6E3",
			font_family: "Playfair Display",
			layout_style: "classic",
			category: "wedding"
		},
		{
			id: "tmpl-garden",
			name: "Garden Romance",
			slug: "garden-romance",
			description: "Template romantis dengan tema taman bunga, warna pastel lembut, dan ilustrasi floral watercolor.",
			thumbnail: "https://images.unsplash.com/photo-1522673607200-164883eeca48?auto=format&fit=crop&w=600&q=80",
			primary_color: "#8B4D6E",
			secondary_color: "#D4849B",
			accent_color: "#FFF0F5",
			font_family: "Great Vibes",
			layout_style: "romantic",
			category: "wedding"
		},
		{
			id: "tmpl-modern",
			name: "Modern Minimalist",
			slug: "modern-minimalist",
			description: "Template modern dan minimalis dengan desain bersih, tipografi bold, dan animasi smooth.",
			thumbnail: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80",
			primary_color: "#2C3E50",
			secondary_color: "#E67E22",
			accent_color: "#ECF0F1",
			font_family: "Montserrat",
			layout_style: "modern",
			category: "general"
		},
		{
			id: "tmpl-royal",
			name: "Royal Midnight",
			slug: "royal-midnight",
			description: "Perpaduan mewah warna biru tengah malam dan emas champagne, menciptakan kesan agung dan eksklusif.",
			thumbnail: "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=600&q=80",
			primary_color: "#1a1a2e",
			secondary_color: "#c0a080",
			accent_color: "#ffffff",
			font_family: "Cinzel",
			layout_style: "royal",
			category: "wedding"
		},
		{
			id: "tmpl-earth",
			name: "Minimalist Earth",
			slug: "minimalist-earth",
			description: "Tema warna bumi (terracotta & sage) yang menenangkan, memberikan kesan hangat, organik, dan estetik.",
			thumbnail: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80",
			primary_color: "#7c6a53",
			secondary_color: "#a3b18a",
			accent_color: "#fefae0",
			font_family: "Lora",
			layout_style: "minimalist",
			category: "general"
		},
		{
			id: "tmpl-classic",
			name: "Classic Elegance",
			slug: "classic-elegance",
			description: "Desain abadi dengan perpaduan warna putih murni dan emas metalik. Memberikan kesan bersih, mewah, dan sangat profesional.",
			thumbnail: "https://images.unsplash.com/photo-1519225495810-751bd131c90d?auto=format&fit=crop&w=600&q=80",
			primary_color: "#ffffff",
			secondary_color: "#d4af37",
			accent_color: "#2c2c2c",
			font_family: "Playfair Display",
			layout_style: "classic",
			category: "wedding"
		},
		{
			id: "tmpl-vintage",
			name: "Vintage Rustic",
			slug: "vintage-rustic",
			description: "Nuansa hangat kayu dan kertas kraft dengan sentuhan retro. Cocok untuk pernikahan tema outdoor atau barn wedding.",
			thumbnail: "https://images.unsplash.com/photo-1458007683879-47560d7e33c3?auto=format&fit=crop&w=600&q=80",
			primary_color: "#5d4037",
			secondary_color: "#d7ccc8",
			accent_color: "#8d6e63",
			font_family: "Special Elite",
			layout_style: "vintage",
			category: "wedding"
		},
		{
			id: "tmpl-celestial",
			name: "Celestial Night",
			slug: "celestial-night",
			description: "Terinspirasi dari keindahan langit malam berbintang. Perpaduan warna navy tua dan silver yang magis.",
			thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
			primary_color: "#0f172a",
			secondary_color: "#94a3b8",
			accent_color: "#f8fafc",
			font_family: "Cinzel Decorative",
			layout_style: "celestial",
			category: "wedding"
		},
		{
			id: "tmpl-tropical",
			name: "Tropical Breeze",
			slug: "tropical-breeze",
			description: "Segar dan ceria dengan palet warna hijau botani dan teal. Sempurna untuk pernikahan tema pantai atau musim panas.",
			thumbnail: "https://images.unsplash.com/photo-1512100356132-d39918387e94?auto=format&fit=crop&w=600&q=80",
			primary_color: "#065f46",
			secondary_color: "#2dd4bf",
			accent_color: "#f0fdfa",
			font_family: "Outfit",
			layout_style: "tropical",
			category: "wedding"
		},
		{
			id: "tmpl-luxury",
			name: "Luxury Emerald",
			slug: "luxury-emerald",
			description: "Kombinasi berkelas antara hijau zamrud tua dan emas murni. Memberikan aura kemewahan yang mendalam.",
			thumbnail: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
			primary_color: "#047857",
			secondary_color: "#f59e0b",
			accent_color: "#fffbeb",
			font_family: "Cormorant Garamond",
			layout_style: "luxury",
			category: "wedding"
		},
		{
			id: "tmpl-romantic",
			name: "Soft Lavender",
			slug: "soft-lavender",
			description: "Lembut dan puitis dengan gradasi warna lavender dan putih. Memberikan kesan damai dan penuh cinta.",
			thumbnail: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80",
			primary_color: "#7e22ce",
			secondary_color: "#e9d5ff",
			accent_color: "#faf5ff",
			font_family: "Alex Brush",
			layout_style: "romantic",
			category: "wedding"
		},
		{
			id: "tmpl-khitan-joy",
			name: "Joyful Sunatan",
			slug: "joyful-sunatan",
			description: "Ceria dan hangat dengan hijau segar dan aksen emas — pas untuk undangan khitan, tasyakuran, atau syukuran anak.",
			thumbnail: "https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=600&q=80",
			primary_color: "#166534",
			secondary_color: "#facc15",
			accent_color: "#f0fdf4",
			font_family: "Montserrat",
			layout_style: "modern",
			category: "khitan"
		},
		{
			id: "tmpl-aqiqah-soft",
			name: "Aqiqah Blush",
			slug: "aqiqah-blush",
			description: "Lembut dengan krem dan blush pink, nuansa menggemaskan untuk aqiqah dan selamatan kelahiran.",
			thumbnail: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80",
			primary_color: "#9d174d",
			secondary_color: "#fbcfe8",
			accent_color: "#fff1f2",
			font_family: "Cormorant Garamond",
			layout_style: "romantic",
			category: "aqiqah"
		},
		{
			id: "tmpl-anniversary-velvet",
			name: "Anniversary Velvet",
			slug: "anniversary-velvet",
			description: "Merah burgundy dan emas lembut — elegan untuk resepsi ulang tahun pernikahan atau milestone bersama pasangan.",
			thumbnail: "https://images.unsplash.com/photo-1529636799528-941f294af16f?auto=format&fit=crop&w=600&q=80",
			primary_color: "#7f1d1d",
			secondary_color: "#d4a574",
			accent_color: "#fef2f2",
			font_family: "Playfair Display",
			layout_style: "classic",
			category: "anniversary"
		},
		{
			id: "tmpl-birthday-pop",
			name: "Birthday Confetti",
			slug: "birthday-confetti",
			description: "Warna-warni ceria dan kontras tegas — cocok untuk pesta ulang tahun anak maupun dewasa.",
			thumbnail: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
			primary_color: "#7c3aed",
			secondary_color: "#f472b6",
			accent_color: "#faf5ff",
			font_family: "Outfit",
			layout_style: "modern",
			category: "birthday"
		},
		{
			id: "tmpl-3d-motion",
			name: "3D Motion",
			slug: "3d-motion",
			description: "A dynamic 3D animated background with floating elements and particle effects.",
			thumbnail: null,
			primary_color: "#0066FF",
			secondary_color: "#00FFCC",
			accent_color: "#F5E6D3",
			font_family: "Arial, sans-serif",
			layout_style: "modern",
			category: "wedding"
		},
		{
			id: "tmpl-gathering-bistro",
			name: "Gathering Bistro",
			slug: "gathering-bistro",
			description: "Hangat seperti kafe: terracotta dan krem. Cocok untuk arisan, reunion keluarga, atau bukber.",
			thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
			primary_color: "#9a3412",
			secondary_color: "#fdba74",
			accent_color: "#fff7ed",
			font_family: "Lora",
			layout_style: "vintage",
			category: "gathering"
		},
		{
			id: "tmpl-corporate-summit",
			name: "Summit Corporate",
			slug: "summit-corporate",
			description: "Bersih dan profesional dengan slate dan biru — untuk seminar, launching, atau undangan formal perusahaan.",
			thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
			primary_color: "#1e293b",
			secondary_color: "#38bdf8",
			accent_color: "#f8fafc",
			font_family: "Montserrat",
			layout_style: "modern",
			category: "corporate"
		}
	]) await db.execute(`INSERT INTO templates (id, name, slug, description, thumbnail, primary_color, secondary_color, accent_color, font_family, layout_style, category) 
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			 ON DUPLICATE KEY UPDATE 
			 	thumbnail = VALUES(thumbnail),
			 	name = VALUES(name),
			 	description = VALUES(description),
			 	primary_color = VALUES(primary_color),
			 	secondary_color = VALUES(secondary_color),
			 	accent_color = VALUES(accent_color),
			 	font_family = VALUES(font_family),
			 	layout_style = VALUES(layout_style),
			 	category = VALUES(category)`, [
		t.id,
		t.name,
		t.slug,
		t.description,
		t.thumbnail,
		t.primary_color,
		t.secondary_color,
		t.accent_color,
		t.font_family,
		t.layout_style,
		t.category
	]);
}
async function seedSettings() {
	const db = await getDb();
	for (const s of [
		{
			key: "app_name",
			value: "Wedding.id"
		},
		{
			key: "premium_price",
			value: "149000"
		},
		{
			key: "addon_guest_price",
			value: "19000"
		},
		{
			key: "addon_guest_quantity",
			value: "50"
		},
		{
			key: "midtrans_server_key",
			value: ""
		},
		{
			key: "midtrans_client_key",
			value: ""
		},
		{
			key: "midtrans_is_production",
			value: "0"
		},
		{
			key: "default_music_url",
			value: "https://server14.mp3quran.net/khalf/004.mp3"
		}
	]) await db.execute("INSERT IGNORE INTO settings (`key`, value) VALUES (?, ?)", [s.key, s.value]);
}
async function seedAdmin() {
	const [rows] = await (await getDb()).execute("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
	if (rows[0].count > 0) return;
	const { createUser } = await import("./users.js");
	await createUser("admin", "admin@wedding.com", "admin123", "admin");
}
async function getGuestStatsByUser(userId) {
	const [rows] = await (await getDb()).execute(`
		SELECT 
			COUNT(g.id) as total,
			SUM(CASE WHEN g.is_attending = 1 THEN 1 ELSE 0 END) as attending,
			SUM(CASE WHEN g.is_attending = 0 AND g.has_responded = 1 THEN 1 ELSE 0 END) as not_attending,
			SUM(CASE WHEN g.has_responded = 0 THEN 1 ELSE 0 END) as no_response
		FROM guests g
		JOIN invitations i ON g.invitation_id = i.id
		WHERE i.user_id = ?
	`, [userId]);
	const stats = rows[0];
	return {
		total: Number(stats.total || 0),
		attending: Number(stats.attending || 0),
		not_attending: Number(stats.not_attending || 0),
		no_response: Number(stats.no_response || 0)
	};
}
//#endregion
export { seedSettings as _, deleteInvitation as a, getGuestStatsByUser as c, getInvitationBySlug as d, getInvitationsByUser as f, seedAdmin as g, getWishesByInvitation as h, deleteGuest as i, getGuestsByInvitation as l, getTemplates as m, addWish as n, duplicateInvitation as o, getTemplateById as p, createInvitation as r, getAllInvitations as s, addGuest as t, getInvitationById as u, seedTemplates as v, updateInvitation as y };
