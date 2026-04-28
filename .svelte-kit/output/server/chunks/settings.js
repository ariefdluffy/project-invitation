import { t as getDb } from "./db.js";
//#region src/lib/server/settings.ts
async function getSetting(key) {
	const [rows] = await (await getDb()).execute("SELECT value FROM settings WHERE `key` = ?", [key]);
	const results = rows;
	if (results.length > 0) return results[0].value;
	return null;
}
async function getAllSettings() {
	const [rows] = await (await getDb()).execute("SELECT `key`, value FROM settings");
	const results = rows;
	const settings = {};
	for (const row of results) settings[row.key] = row.value;
	return settings;
}
async function updateSetting(key, value) {
	await (await getDb()).execute("INSERT INTO settings (`key`, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = CURRENT_TIMESTAMP", [key, value]);
}
//#endregion
export { getSetting as n, updateSetting as r, getAllSettings as t };
