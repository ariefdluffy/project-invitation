import { n as private_env } from "./shared-server.js";
import mysql from "mysql2/promise";
//#region src/lib/server/db.ts
var pool = null;
async function getDb() {
	if (pool) return pool;
	pool = mysql.createPool({
		host: private_env.DB_HOST || "localhost",
		user: private_env.DB_USER || "root",
		password: private_env.DB_PASSWORD || "",
		database: private_env.DB_NAME || "wedding_db",
		waitForConnections: true,
		connectionLimit: 10,
		queueLimit: 0,
		enableKeepAlive: true,
		keepAliveInitialDelay: 0
	});
	try {
		const conn = await pool.getConnection();
		console.log("Successfully connected to MySQL database");
		conn.release();
	} catch (err) {
		console.error("Failed to connect to MySQL database:", err);
		throw err;
	}
	return pool;
}
//#endregion
export { getDb as t };
