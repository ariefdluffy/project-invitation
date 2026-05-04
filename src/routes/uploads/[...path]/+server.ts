import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { validateUploadsSignature } from '$lib/server/upload-signing';
import { getInvitationById } from '$lib/server/invitations';

export const GET: RequestHandler = async ({ params, locals, url }) => {
	const baseDir = path.join(process.cwd(), 'static', 'uploads');
	const normalizedRelativePath = path.posix
		.normalize(params.path)
		.replace(/^([.][/])+/, '');
	const fsRelativePath = normalizedRelativePath.split('/').join(path.sep);
	const filePath = path.resolve(baseDir, fsRelativePath);

	if (!filePath.startsWith(baseDir + path.sep)) {
		throw error(400, 'Invalid path');
	}

	const pathParts = normalizedRelativePath.split('/').filter(Boolean);
	const ownerId = pathParts[0];
	const isAdmin = locals.user?.role === 'admin';
	const fileName = pathParts[pathParts.length - 1] || '';
	const exp = Number(url.searchParams.get('exp') || 0);
	const sig = url.searchParams.get('sig') || '';
	const hasValidSignature = validateUploadsSignature(normalizedRelativePath, exp, sig);

	let hasInvitationAccess = false;
	if (locals.user && !isAdmin && ownerId !== locals.user.id) {
		const match = fileName.match(/^([0-9a-fA-F-]{36})-/);
		if (match) {
			const invitation = await getInvitationById(match[1]);
			hasInvitationAccess = !!invitation && invitation.user_id === locals.user.id;
		}
	}

	if (!locals.user) {
		if (!hasValidSignature) {
			throw error(401, 'Unauthorized');
		}
	} else if (!isAdmin && ownerId !== locals.user.id && !hasInvitationAccess && !hasValidSignature) {
		throw error(403, 'Forbidden');
	}

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
				'Cache-Control': 'private, max-age=0, must-revalidate'
			}
		});
	} catch (err) {
		throw error(500, 'Error reading file');
	}
};
