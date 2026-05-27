import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';

export const GET: RequestHandler = async () => {
	const start = Date.now();
	let dbOk = false;
	try {
		const db = await getDb();
		await db.execute('SELECT 1');
		dbOk = true;
	} catch { dbOk = false; }

	return json({
		status: dbOk ? 'healthy' : 'degraded',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		database: dbOk ? 'connected' : 'disconnected',
		responseTime: Date.now() - start
	});
};
