import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { logAudit } from '$lib/server/audit-log';
import { checkRateLimit, ipKey } from '$lib/server/rate-limiter';
import { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const TEMPLATES_DIR = join(process.cwd(), 'static', 'templates');

function getTemplatePath(category: string, id: string): string {
	return join(TEMPLATES_DIR, category, `${id}.json`);
}

export const load: PageServerLoad = async ({ parent }) => {
	const layoutData = await parent();
	return {
		templateCount: layoutData.templates?.length || 0
	};
};

export const actions: Actions = {
	create: async ({ request, locals, getClientAddress }) => {
		if (!locals.user || locals.user.role !== 'admin') return fail(403, { error: 'Tidak memiliki akses' });
		const rl = checkRateLimit(ipKey(getClientAddress(), 'admin-tmpl-create'), { maxRequests: 10, windowMs: 60000 });
		if (!rl.allowed) return fail(429, { error: 'Terlalu banyak permintaan' });

		const formData = await request.formData();
		const id = (formData.get('id') as string || '').trim();
		const name = formData.get('name') as string;
		const category = formData.get('category') as string;
		const description = formData.get('description') as string || '';
		const primaryColor = formData.get('primary_color') as string || '#d4a574';
		const secondaryColor = formData.get('secondary_color') as string || '#f5e6d3';
		const accentColor = formData.get('accent_color') as string || '#6c63ff';
		const fontFamily = formData.get('font_family') as string || 'Inter, sans-serif';
		const layoutStyle = formData.get('layout_style') as string || 'classic';

		if (!id || !name || !category) return fail(400, { error: 'ID, nama, dan kategori wajib diisi' });
		if (!/^[a-z0-9-]+$/.test(id)) return fail(400, { error: 'ID hanya boleh huruf kecil, angka, dan dash' });

		const catDir = join(TEMPLATES_DIR, category);
		if (!existsSync(catDir)) mkdirSync(catDir, { recursive: true });

		const templatePath = getTemplatePath(category, id);
		if (existsSync(templatePath)) return fail(409, { error: 'Template dengan ID ini sudah ada' });

		const content = formData.get('content') as string;
		let parsedContent: any;
		try {
			parsedContent = content ? JSON.parse(content) : {};
		} catch {
			return fail(400, { error: 'Content JSON tidak valid' });
		}

		const template = {
			id,
			name,
			description,
			colors: { primary: primaryColor, secondary: secondaryColor, accent: accentColor },
			font_family: fontFamily,
			layout_style: layoutStyle,
			background_type: 'solid',
			content: {
				sections: [],
				...parsedContent
			}
		};

		writeFileSync(templatePath, JSON.stringify(template, null, 2));
		logAudit({ action: 'template.create', userId: locals.user.id, details: `Created template ${name} (${category}/${id})` }).catch(() => {});
		return { success: true, message: `Template "${name}" berhasil dibuat` };
	},

	update: async ({ request, locals, getClientAddress }) => {
		if (!locals.user || locals.user.role !== 'admin') return fail(403, { error: 'Tidak memiliki akses' });
		const rl = checkRateLimit(ipKey(getClientAddress(), 'admin-tmpl-update'), { maxRequests: 20, windowMs: 60000 });
		if (!rl.allowed) return fail(429, { error: 'Terlalu banyak permintaan' });

		const formData = await request.formData();
		const id = formData.get('id') as string;
		const category = formData.get('category') as string;
		if (!id || !category) return fail(400, { error: 'Parameter tidak lengkap' });

		const templatePath = getTemplatePath(category, id);
		if (!existsSync(templatePath)) return fail(404, { error: 'Template tidak ditemukan' });

		const existing = JSON.parse(readFileSync(templatePath, 'utf8'));
		existing.name = formData.get('name') as string || existing.name;
		existing.description = formData.get('description') as string ?? existing.description;
		existing.colors = {
			primary: formData.get('primary_color') as string || existing.colors?.primary,
			secondary: formData.get('secondary_color') as string || existing.colors?.secondary,
			accent: formData.get('accent_color') as string || existing.colors?.accent
		};
		existing.font_family = formData.get('font_family') as string || existing.font_family;
		existing.layout_style = formData.get('layout_style') as string || existing.layout_style;

		const content = formData.get('content') as string;
		if (content) {
			try { existing.content = { ...existing.content, ...JSON.parse(content) }; } catch { return fail(400, { error: 'Content JSON tidak valid' }); }
		}

		writeFileSync(templatePath, JSON.stringify(existing, null, 2));
		logAudit({ action: 'template.update', userId: locals.user.id, details: `Updated template ${id}` }).catch(() => {});
		return { success: true, message: `Template berhasil diperbarui` };
	},

	delete: async ({ request, locals, getClientAddress }) => {
		if (!locals.user || locals.user.role !== 'admin') return fail(403, { error: 'Tidak memiliki akses' });
		const rl = checkRateLimit(ipKey(getClientAddress(), 'admin-tmpl-delete'), { maxRequests: 10, windowMs: 60000 });
		if (!rl.allowed) return fail(429, { error: 'Terlalu banyak permintaan' });

		const formData = await request.formData();
		const id = formData.get('id') as string;
		const category = formData.get('category') as string;
		if (!id || !category) return fail(400, { error: 'Parameter tidak lengkap' });

		const templatePath = getTemplatePath(category, id);
		if (!existsSync(templatePath)) return fail(404, { error: 'Template tidak ditemukan' });

		// Check if any invitations use this template
		const db = await getDb();
		const [rows] = await db.execute('SELECT COUNT(*) as count FROM invitations WHERE template_id = ?', [id]);
		const count = (rows as any[])[0]?.count || 0;
		if (count > 0) {
			const force = formData.get('force') === 'true';
			if (!force) {
				return fail(409, { error: `Template dipakai oleh ${count} undangan. Set force=true untuk tetap hapus.`, usedBy: count } as any);
			}
		}

		unlinkSync(templatePath);
		logAudit({ action: 'template.delete', userId: locals.user.id, details: `Deleted template ${id} (was used by ${count} invitations)` }).catch(() => {});
		return { success: true, message: `Template berhasil dihapus${count > 0 ? ` (sebelumnya dipakai ${count} undangan)` : ''}` };
	}
};
