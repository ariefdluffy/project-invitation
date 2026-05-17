import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/server/email';
import { getSetting } from '$lib/server/settings';

export async function GET({ url }) {
	const to = url.searchParams.get('to');

	if (!to) {
		return json({ error: 'Missing ?to=email parameter' }, { status: 400 });
	}

	const appName = (await getSetting('app_name')) || 'Wedding.id';

	const result = await sendEmail({
		to,
		subject: `Test Email - ${appName}`,
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
				<h2 style="color: #1a1a2e;">Test Email</h2>
				<p>Email ini berhasil terkirim dari server.</p>
				<p>Waktu: ${new Date().toISOString()}</p>
			</div>
		`,
		text: `Test Email - Email ini berhasil terkirim dari server.`
	});

	return json(result);
}
