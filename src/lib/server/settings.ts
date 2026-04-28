import { getDb } from './db';

export async function getSetting(key: string): Promise<string | null> {
	const db = await getDb();
	const [rows] = await db.execute('SELECT value FROM settings WHERE `key` = ?', [key]);
	const results = rows as { value: string }[];
	
	if (results.length > 0) {
		return results[0].value;
	}
	return null;
}

export async function getAllSettings(): Promise<Record<string, string>> {
	const db = await getDb();
	const [rows] = await db.execute('SELECT `key`, value FROM settings');
	const results = rows as { key: string, value: string }[];
	const settings: Record<string, string> = {};
	
	for (const row of results) {
		settings[row.key] = row.value;
	}
	return settings;
}

export async function updateSetting(key: string, value: string): Promise<void> {
	const db = await getDb();
	await db.execute(
		'INSERT INTO settings (`key`, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = CURRENT_TIMESTAMP',
		[key, value]
	);
}
