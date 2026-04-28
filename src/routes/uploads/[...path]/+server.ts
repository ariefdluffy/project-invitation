import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export const GET: RequestHandler = async ({ params }) => {
	const filePath = path.join(process.cwd(), 'static', 'uploads', params.path);

	if (!fs.existsSync(filePath)) {
		throw error(404, 'File not found');
	}

	try {
		const fileBuffer = fs.readFileSync(filePath);
		
		// Determine content type based on extension
		const ext = path.extname(filePath).toLowerCase();
		let contentType = 'application/octet-stream';
		if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
		else if (ext === '.png') contentType = 'image/png';
		else if (ext === '.gif') contentType = 'image/gif';
		else if (ext === '.webp') contentType = 'image/webp';
		else if (ext === '.svg') contentType = 'image/svg+xml';

		return new Response(fileBuffer, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=31536000'
			}
		});
	} catch (err) {
		throw error(500, 'Error reading file');
	}
};
