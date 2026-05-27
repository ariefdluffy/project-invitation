import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { trackPageView } from '$lib/server/analytics';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	try {
		const body = await request.json();
		const { invitationId, guestName } = body;
		if (!invitationId) return json({ error: 'Missing invitationId' }, { status: 400 });

		await trackPageView({
			invitationId,
			ip: getClientAddress(),
			userAgent: request.headers.get('user-agent') || undefined,
			referrer: request.headers.get('referer') || undefined,
			guestName: guestName || undefined
		});

		return json({ success: true });
	} catch (err) {
		console.error('[TrackView] Error:', err);
		return json({ error: 'Internal error' }, { status: 500 });
	}
};
