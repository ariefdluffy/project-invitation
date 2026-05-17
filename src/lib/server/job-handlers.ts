/**
 * Job handler registrations. Imported once from `hooks.server.ts` so the
 * background worker knows how to process each job type.
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { registerJobHandler } from './job-queue';
import { sendEmail } from './email';
import { purgeOldSessions } from './session-store';
import { createLogger } from './logger';

const log = createLogger('JobHandlers');

let registered = false;

export function registerAllJobHandlers(): void {
	if (registered) return;
	registered = true;

	// Email send (replaces direct `sendEmail` calls in hot paths)
	registerJobHandler('email.send', async (payload: { to: string; subject: string; html?: string; text?: string }) => {
		const result = await sendEmail({
			to: payload.to,
			subject: payload.subject,
			html: payload.html,
			text: payload.text
		});
		if (!result.sent) {
			throw new Error(result.error || 'Email send failed');
		}
	});

	// Image optimize: resize + convert to webp at given quality.
	// Payload: { sourcePath, destPath, width, quality }
	registerJobHandler(
		'image.optimize',
		async (payload: { sourcePath: string; destPath?: string; width?: number; quality?: number }) => {
			const src = path.resolve(payload.sourcePath);
			const dest = path.resolve(payload.destPath || src.replace(/\.(jpe?g|png)$/i, '.webp'));
			const width = payload.width ?? 1600;
			const quality = payload.quality ?? 80;

			const buf = await fs.readFile(src);
			const out = await sharp(buf)
				.rotate()
				.resize({ width, withoutEnlargement: true })
				.webp({ quality })
				.toBuffer();
			await fs.writeFile(dest, out);
			log.info('Image optimized', { src: payload.sourcePath, dest, bytes: out.length });
		}
	);

	// Periodic session cleanup. Enqueue with a recurring scheduler if desired.
	registerJobHandler('session.purge', async (payload: { daysToKeep?: number } = {}) => {
		const removed = await purgeOldSessions(payload.daysToKeep ?? 30);
		log.info('Sessions purged', { removed });
	});

	log.info('All job handlers registered');
}
