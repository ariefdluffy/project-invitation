#!/usr/bin/env node

/**
 * Database Backup Script
 * Exports complete database dump (schema + data) to SQL file
 * 
 * Usage: node backup-database.js [output-path]
 * Example: node backup-database.js ./backups/
 */

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database connection config
const dbConfig = {
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_NAME || 'wedding_db'
};

const backupDir = process.argv[2] || path.join(__dirname, 'backups');

// Create backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
	fs.mkdirSync(backupDir, { recursive: true });
}

async function backupDatabase() {
	let connection;
	
	try {
		console.log('🔄 Connecting to MySQL database...');
		connection = await mysql.createConnection(dbConfig);
		console.log('✅ Connected successfully');

		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		const backupFile = path.join(backupDir, `database_backup_${timestamp}.sql`);
		
		let backupContent = '';
		
		// Header
		backupContent += `-- ============================================================\n`;
		backupContent += `-- Wedding Invitation Database Backup\n`;
		backupContent += `-- Generated: ${new Date().toISOString()}\n`;
		backupContent += `-- Database: ${dbConfig.database}\n`;
		backupContent += `-- ============================================================\n\n`;
		
		backupContent += `-- Drop and recreate database\n`;
		backupContent += `DROP DATABASE IF EXISTS \`${dbConfig.database}\`;\n`;
		backupContent += `CREATE DATABASE \`${dbConfig.database}\`;\n`;
		backupContent += `USE \`${dbConfig.database}\`;\n\n`;

		// Get all tables
		console.log('📋 Fetching database tables...');
		const [tables] = await connection.query(
			`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
			[dbConfig.database]
		);

		// Export each table
		for (const table of tables) {
			const tableName = table.TABLE_NAME;
			console.log(`📊 Backing up table: ${tableName}`);

			// Get CREATE TABLE statement
			const [createTableResult] = await connection.query(
				`SHOW CREATE TABLE \`${tableName}\``
			);
			
			backupContent += `-- ============================================================\n`;
			backupContent += `-- Table: ${tableName}\n`;
			backupContent += `-- ============================================================\n`;
			backupContent += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
			backupContent += createTableResult[0]['Create Table'] + ';\n\n';

			// Get table data
			const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
			
			if (rows.length > 0) {
				backupContent += `-- Data for table \`${tableName}\`\n`;
				backupContent += `LOCK TABLES \`${tableName}\` WRITE;\n`;
				backupContent += `/*!40000 ALTER TABLE \`${tableName}\` DISABLE KEYS */;\n`;

				for (const row of rows) {
					const columns = Object.keys(row);
					const values = columns.map(col => {
						const value = row[col];
						if (value === null) return 'NULL';
						if (typeof value === 'string') {
							return `'${value.replace(/'/g, "\\'")}'`;
						}
						if (Buffer.isBuffer(value)) {
							return `X'${value.toString('hex')}'`;
						}
						return String(value);
					});

					backupContent += `INSERT INTO \`${tableName}\` (${columns.map(c => `\`${c}\``).join(', ')}) VALUES (${values.join(', ')});\n`;
				}

				backupContent += `/*!40000 ALTER TABLE \`${tableName}\` ENABLE KEYS */;\n`;
				backupContent += `UNLOCK TABLES;\n\n`;
			}
		}

		// Write to file
		console.log(`💾 Writing backup to: ${backupFile}`);
		fs.writeFileSync(backupFile, backupContent, 'utf8');
		
		const fileSize = (fs.statSync(backupFile).size / 1024).toFixed(2);
		console.log(`✅ Backup completed successfully! (${fileSize} KB)`);
		console.log(`📂 File: ${backupFile}\n`);

		await connection.end();
		
	} catch (error) {
		console.error('❌ Backup failed:', error.message);
		process.exit(1);
	}
}

backupDatabase();
