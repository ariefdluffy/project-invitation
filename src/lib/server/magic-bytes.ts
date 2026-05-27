/**
 * Validate file magic bytes for image uploads.
 * Checks actual file signature (magic bytes), not just MIME type from header.
 */

const MAGIC_BYTES: Record<string, { bytes: number[]; offset: number; mime: string; ext: string }> = {
	jpeg: { bytes: [0xFF, 0xD8, 0xFF], offset: 0, mime: 'image/jpeg', ext: 'jpg' },
	jpeg2: { bytes: [0xFF, 0xD8, 0xFF, 0xE0], offset: 0, mime: 'image/jpeg', ext: 'jpg' },
	jpeg3: { bytes: [0xFF, 0xD8, 0xFF, 0xE1], offset: 0, mime: 'image/jpeg', ext: 'jpg' },
	jpeg4: { bytes: [0xFF, 0xD8, 0xFF, 0xE2], offset: 0, mime: 'image/jpeg', ext: 'jpg' },
	png: { bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], offset: 0, mime: 'image/png', ext: 'png' },
	gif: { bytes: [0x47, 0x49, 0x46], offset: 0, mime: 'image/gif', ext: 'gif' },
	webp: { bytes: [0x52, 0x49, 0x46, 0x46], offset: 0, mime: 'image/webp', ext: 'webp' }
};

const ALLOWED_TYPES = ['image/jpeg', 'image/png'] as const;
export type AllowedMimeType = (typeof ALLOWED_TYPES)[number];

export function isAllowedImageType(buffer: Uint8Array): AllowedMimeType | null {
	for (const sig of Object.values(MAGIC_BYTES)) {
		if (buffer.length < sig.offset + sig.bytes.length) continue;
		let match = true;
		for (let i = 0; i < sig.bytes.length; i++) {
			if (buffer[sig.offset + i] !== sig.bytes[i]) {
				match = false;
				break;
			}
		}
		if (match && (sig.mime === 'image/jpeg' || sig.mime === 'image/png')) {
			return sig.mime as AllowedMimeType;
		}
	}
	return null;
}

export function getAllowedMimeTypes(): string[] {
	return [...ALLOWED_TYPES];
}
