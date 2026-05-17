import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { getTemplates } from '$lib/server/invitations';

/**
 * Dynamic sitemap.xml generator.
 *
 * Includes:
 *  - Static marketing pages
 *  - Public template demo pages
 *  - Published invitation pages
 *
 * Cached for 1 hour to keep DB load low.
 */
export const GET: RequestHandler = async ({ url, setHeaders }) => {
	const origin = url.origin;
	const now = new Date().toISOString().slice(0, 10);

	const staticEntries: SitemapEntry[] = [
		{ loc: `${origin}/`, lastmod: now, changefreq: 'weekly', priority: 1.0 }
	];

	// Templates (public demo pages)
	let templateEntries: SitemapEntry[] = [];
	try {
		const templates = await getTemplates();
		templateEntries = templates.map((t) => ({
			loc: `${origin}/demo/${t.id}`,
			lastmod: now,
			changefreq: 'monthly',
			priority: 0.6
		}));
	} catch {
		templateEntries = [];
	}

	// Published invitations
	let invitationEntries: SitemapEntry[] = [];
	try {
		const db = await getDb();
		const [rows] = await db.execute(
			`SELECT slug, updated_at FROM invitations WHERE is_published = 1 ORDER BY updated_at DESC LIMIT 5000`
		);
		invitationEntries = (rows as { slug: string; updated_at: string | null }[]).map((row) => ({
			loc: `${origin}/invitation/${row.slug}`,
			lastmod: row.updated_at ? row.updated_at.slice(0, 10) : now,
			changefreq: 'weekly',
			priority: 0.7
		}));
	} catch {
		invitationEntries = [];
	}

	const all = [...staticEntries, ...templateEntries, ...invitationEntries];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(renderEntry).join('\n')}
</urlset>`;

	setHeaders({
		'Content-Type': 'application/xml; charset=utf-8',
		'Cache-Control': 'public, max-age=3600'
	});

	return new Response(xml);
};

interface SitemapEntry {
	loc: string;
	lastmod: string;
	changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
	priority: number;
}

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function renderEntry(entry: SitemapEntry): string {
	return [
		'  <url>',
		`    <loc>${escapeXml(entry.loc)}</loc>`,
		`    <lastmod>${entry.lastmod}</lastmod>`,
		`    <changefreq>${entry.changefreq}</changefreq>`,
		`    <priority>${entry.priority.toFixed(1)}</priority>`,
		'  </url>'
	].join('\n');
}
