#!/usr/bin/env node

/**
 * Database Restore Script
 * Restores database from SQL backup file
 * 
 * Usage: node restore-database.js <backup-file-path>
 * Example: node restore-database.js ./backups/database_backup_2026-04-25.sql
 */

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database connection config
const dbConfig = {
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_NAME || 'wedding_db'
};

const backupFile = process.argv[2];

if (!backupFile) {
	console.error('❌ Usage: node restore-database.js <backup-file-path>');
	console.error('Example: node restore-database.js ./backups/database_backup_2026-04-25T12-30-45-123Z.sql');
	process.exit(1);
}

if (!fs.existsSync(backupFile)) {
	console.error(`❌ Backup file not found: ${backupFile}`);
	process.exit(1);
}

async function askConfirmation(question) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	return new Promise(resolve => {
		rl.question(question, answer => {
			rl.close();
			resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
		});
	});
}

async function restoreDatabase() {
	let connection;
	
	try {
		const fileSize = (fs.statSync(backupFile).size / 1024).toFixed(2);
		console.log(`\n📂 Backup file: ${backupFile}`);
		console.log(`📊 File size: ${fileSize} KB\n`);
		
		const confirmed = await askConfirmation('⚠️  This will overwrite existing data. Continue? (y/n): ');
		
		if (!confirmed) {
			console.log('❌ Restore cancelled.');
			process.exit(0);
		}

		console.log('\n🔄 Connecting to MySQL database...');
		// Connect without database first to allow dropping it
		const tempConfig = { ...dbConfig };
		delete tempConfig.database;
		
		connection = await mysql.createConnection(tempConfig);
		console.log('✅ Connected successfully');

		// Read backup file
		console.log('📖 Reading backup file...');
		let sqlContent = fs.readFileSync(backupFile, 'utf8');

		// Split by statements
		const statements = sqlContent
			.split(';')
			.map(s => s.trim())
			.filter(s => s && !s.startsWith('--'));

		console.log(`🔨 Executing ${statements.length} SQL statements...\n`);

		let executed = 0;
		for (const statement of statements) {
			try {
				await connection.query(statement);
				executed++;
				
				// Show progress every 10 statements
				if (executed % 10 === 0) {
					console.log(`✓ Executed ${executed}/${statements.length} statements...`);
				}
			} catch (error) {
				if (!error.message.includes('already exists') && !error.message.includes('cannot find')) {
					console.error(`⚠️  Statement error: ${error.message}`);
					console.error(`Statement: ${statement.substring(0, 100)}...`);
				}
			}
		}

		console.log(`\n✅ Restore completed! (${executed} statements executed)`);
		await connection.end();
		
	} catch (error) {
		console.error('❌ Restore failed:', error.message);
		process.exit(1);
	}
}

restoreDatabase();
