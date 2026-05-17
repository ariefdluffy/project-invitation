/**
 * Centralized logger with environment-aware levels and PII redaction.
 *
 * - In production: only `info`, `warn`, `error` are emitted (debug is suppressed).
 * - In development: all levels are emitted.
 * - Automatically redacts known sensitive keys (password, token, secret, key, ...).
 *
 * Use this in place of `console.log` to ensure debug data does not leak in production.
 */

import { dev } from '$app/environment';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3
};

function getMinLevel(): LogLevel {
	const envLevel = (typeof process !== 'undefined' && process.env?.LOG_LEVEL) as LogLevel | undefined;
	if (envLevel && envLevel in LEVEL_PRIORITY) return envLevel;
	return dev ? 'debug' : 'info';
}

const SENSITIVE_KEYS = [
	'password',
	'pass',
	'pwd',
	'token',
	'secret',
	'serverkey',
	'server_key',
	'apikey',
	'api_key',
	'authorization',
	'auth',
	'session',
	'cookie',
	'signature_key',
	'midtrans_server_key',
	'midtrans_client_key',
	'reset_token',
	'email_verify_token'
];

function isSensitiveKey(key: string): boolean {
	const k = key.toLowerCase();
	return SENSITIVE_KEYS.some((s) => k.includes(s));
}

function redactValue(_key: string, value: unknown): unknown {
	if (value == null) return value;
	if (typeof value === 'string') {
		if (value.length === 0) return '';
		if (value.length <= 4) return '***';
		return `***${value.slice(-2)}`;
	}
	if (typeof value === 'number' || typeof value === 'boolean') {
		return '***';
	}
	return '[redacted]';
}

function redact(obj: unknown, seen: WeakSet<object> = new WeakSet()): unknown {
	if (obj == null || typeof obj !== 'object') return obj;
	if (seen.has(obj as object)) return '[circular]';
	seen.add(obj as object);

	if (Array.isArray(obj)) {
		return obj.map((v) => redact(v, seen));
	}

	const out: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
		if (isSensitiveKey(k)) {
			out[k] = redactValue(k, v);
		} else if (v && typeof v === 'object') {
			out[k] = redact(v, seen);
		} else {
			out[k] = v;
		}
	}
	return out;
}

function shouldLog(level: LogLevel): boolean {
	return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[getMinLevel()];
}

function format(level: LogLevel, scope: string, message: string, meta?: unknown): string {
	const ts = new Date().toISOString();
	const base = `${ts} [${level.toUpperCase()}] [${scope}] ${message}`;
	if (meta === undefined) return base;
	try {
		return `${base} ${JSON.stringify(redact(meta))}`;
	} catch {
		return `${base} [unserializable meta]`;
	}
}

export interface Logger {
	debug: (message: string, meta?: unknown) => void;
	info: (message: string, meta?: unknown) => void;
	warn: (message: string, meta?: unknown) => void;
	error: (message: string, meta?: unknown) => void;
}

export function createLogger(scope: string): Logger {
	return {
		debug: (msg, meta) => {
			if (shouldLog('debug')) console.debug(format('debug', scope, msg, meta));
		},
		info: (msg, meta) => {
			if (shouldLog('info')) console.info(format('info', scope, msg, meta));
		},
		warn: (msg, meta) => {
			if (shouldLog('warn')) console.warn(format('warn', scope, msg, meta));
		},
		error: (msg, meta) => {
			if (shouldLog('error')) console.error(format('error', scope, msg, meta));
		}
	};
}

export const logger = createLogger('app');
