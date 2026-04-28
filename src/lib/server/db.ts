import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

let pool: mysql.Pool | null = null;

export async function getDb(): Promise<mysql.Pool> {
	if (pool) return pool;

	pool = mysql.createPool({
		host: env.DB_HOST || 'localhost',
		user: env.DB_USER || 'root',
		password: env.DB_PASSWORD || '',
		database: env.DB_NAME || 'wedding_db',
		waitForConnections: true,
		connectionLimit: 10,
		queueLimit: 0,
		enableKeepAlive: true,
		keepAliveInitialDelay: 0
	});

	// Test connection
	try {
		const conn = await pool.getConnection();
		console.log('Successfully connected to MySQL database');
		conn.release();
	} catch (err) {
		console.error('Failed to connect to MySQL database:', err);
		throw err;
	}

	return pool;
}

// saveDb is no longer needed for MySQL
export function saveDb() {}
