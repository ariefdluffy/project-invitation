import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export interface OptimizeOptions {
	width?: number;
	height?: number;
	quality?: number;
	fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

const DEFAULT_OPTIONS: OptimizeOptions = {
	width: 1920,
	quality: 80,
	fit: 'inside'
};

export async function optimizeImage(
	inputBuffer: Buffer,
	options: OptimizeOptions = {}
): Promise<Buffer> {
	const opts = { ...DEFAULT_OPTIONS, ...options };
	try {
		let pipeline = sharp(inputBuffer);

		if (opts.width || opts.height) {
			pipeline = pipeline.resize(opts.width, opts.height, {
				fit: opts.fit || 'inside',
				withoutEnlargement: true
			});
		}

		// Determine format and apply compression
		const metadata = await sharp(inputBuffer).metadata();
		if (metadata.format === 'png') {
			pipeline = pipeline.png({ quality: opts.quality });
		} else {
			pipeline = pipeline.jpeg({ quality: opts.quality, mozjpeg: true });
		}

		return await pipeline.toBuffer();
	} catch (err) {
		console.error('[ImageOptimizer] Error:', err);
		return inputBuffer; // Fallback to original on error
	}
}

export async function saveOptimizedImage(
	inputBuffer: Buffer,
	filePath: string,
	options: OptimizeOptions = {}
): Promise<{ width: number; height: number; size: number }> {
	const optimized = await optimizeImage(inputBuffer, options);
	fs.writeFileSync(filePath, optimized);

	const metadata = await sharp(optimized).metadata();
	return {
		width: metadata.width || 0,
		height: metadata.height || 0,
		size: optimized.length
	};
}
