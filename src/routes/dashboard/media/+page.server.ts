import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import fs from 'fs';
import path from 'path';

export const load: PageServerLoad = async ({ locals }) => {
	const userDir = path.join(process.cwd(), 'static', 'uploads', locals.user!.id);
	
	let files: { name: string, url: string, size: number, mtimeMs: number }[] = [];
	
	if (fs.existsSync(userDir)) {
		const fileNames = fs.readdirSync(userDir);
		files = fileNames.map(name => {
			const stat = fs.statSync(path.join(userDir, name));
			return {
				name,
				url: `/uploads/${locals.user!.id}/${name}`,
				size: stat.size,
				mtimeMs: stat.mtimeMs
			};
		}).sort((a, b) => b.mtimeMs - a.mtimeMs); // Sort by newest
	}

	return { files };
};

export const actions: Actions = {
	upload: async ({ request, locals }) => {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file || file.size === 0) {
			return fail(400, { error: 'Tidak ada file yang dipilih' });
		}

		const allowedTypes = ['image/jpeg', 'image/png'];
		if (!allowedTypes.includes(file.type)) {
			return fail(400, { error: 'Hanya file JPG dan PNG yang diperbolehkan' });
		}

		const maxFileSize = Number(env.MAX_FILE_SIZE || 1048576);
		if (file.size > maxFileSize) {
			return fail(400, { error: 'Ukuran file melebihi batas 1MB' });
		}

		// Create user directory if it doesn't exist
		const userDir = path.join(process.cwd(), 'static', 'uploads', locals.user!.id);
		if (!fs.existsSync(userDir)) {
			fs.mkdirSync(userDir, { recursive: true });
		}

		// Clean filename
		const ext = path.extname(file.name);
		const basename = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
		const finalName = `${basename}-${Date.now()}${ext}`;
		
		const filePath = path.join(userDir, finalName);
		
		try {
			const buffer = Buffer.from(await file.arrayBuffer());
			fs.writeFileSync(filePath, buffer);
			return { success: true, message: 'Foto berhasil diupload' };
		} catch (err) {
			console.error(err);
			return fail(500, { error: 'Gagal menyimpan file' });
		}
	},

	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const fileName = formData.get('fileName') as string;

		if (!fileName) return fail(400, { error: 'Nama file tidak valid' });

		const filePath = path.join(process.cwd(), 'static', 'uploads', locals.user!.id, fileName);
		
		try {
			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath);
			}
			return { success: true, message: 'Foto berhasil dihapus' };
		} catch (err) {
            console.error('[Delete Error]:', err);
			return fail(500, { error: 'Gagal menghapus file server: ' + err.message });
		}
	}
};
