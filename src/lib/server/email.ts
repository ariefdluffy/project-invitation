import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

let transporter: nodemailer.Transporter | null = null;

interface EmailConfig {
	host: string;
	port: number;
	user: string;
	pass: string;
	fromName: string;
	fromEmail: string;
}

function getConfig(): EmailConfig | null {
	const host = env.SMTP_HOST;
	const port = parseInt(env.SMTP_PORT || '0');
	const user = env.SMTP_USER;
	const pass = env.SMTP_PASS;
	const fromName = env.SMTP_FROM_NAME || 'Wedding Invitation';
	const fromEmail = env.SMTP_FROM_EMAIL || user || 'noreply@example.com';

	if (!host || !port || !user || !pass) {
		return null;
	}

	return { host, port, user, pass, fromName, fromEmail };
}

function getTransporter(): nodemailer.Transporter | null {
	if (transporter) return transporter;

	const config = getConfig();
	if (!config) return null;

	console.log('[Email] Config:', { host: config.host, port: config.port, user: config.user });

	transporter = nodemailer.createTransport({
		host: config.host,
		port: config.port,
		secure: config.port === 465,
		requireTLS: true,
		auth: {
			user: config.user,
			pass: config.pass
		}
	});

	// Verify connection on startup
	transporter.verify((err, success) => {
		if (err) {
			console.error('[Email] Transport verify failed:', err.message);
		} else {
			console.log('[Email] Transport ready:', success);
		}
	});

	return transporter;
}

export interface EmailOptions {
	to: string;
	subject: string;
	text?: string;
	html?: string;
}

export async function sendVerificationEmail(to: string, verifyLink: string, appName: string): Promise<{ sent: boolean; error?: string }> {
	return sendEmail({
		to,
		subject: `Verifikasi Email - ${appName}`,
		html: `
		<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
			<h2 style="color: #1a1a2e;">Verifikasi Email</h2>
			<p>Selamat! Anda telah berhasil membuat akun.</p>
			<p>Klik tombol di bawah untuk verifikasi email Anda:</p>
			<div style="text-align: center; margin: 32px 0;">
				<a href="${verifyLink}"
					style="display: inline-block; padding: 12px 32px; background: #d4a574; color: #fff;
						   text-decoration: none; border-radius: 8px; font-weight: 600;">
					Verifikasi Email
				</a>
			</div>
			<p style="color: #666; font-size: 14px;">Link verifikasi berlaku selama 24 jam.</p>
			<p style="color: #666; font-size: 14px;">Jika Anda tidak merasa membuat akun, abaikan email ini.</p>
			<hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
			<p style="color: #999; font-size: 12px;">&copy; ${new Date().getFullYear()} ${appName}</p>
		</div>
	`,
		text: `
Verifikasi Email - ${appName}


Selamat! Anda telah berhasil membuat akun.

Klik link berikut untuk verifikasi email:
${verifyLink}

Link verifikasi berlaku selama 24 jam.
Jika Anda tidak merasa membuat akun, abaikan email ini.
		`.trim()
	});
}

/**
 * Send an email via configured SMTP.
 * Returns `{ sent: true }` on success, `{ sent: false, error: string }` on failure.
 * If SMTP is not configured, returns `{ sent: false, error: 'SMTP_NOT_CONFIGURED' }`.
 */
export async function sendEmail(options: EmailOptions): Promise<{ sent: boolean; error?: string }> {
	const t = getTransporter();
	const config = getConfig();

	if (!t || !config) {
		console.warn('[Email] SMTP not configured. Skipping email send.');
		return { sent: false, error: 'SMTP_NOT_CONFIGURED' };
	}

	try {
		await t.sendMail({
			from: `"${config.fromName}" <${config.fromEmail}>`,
			to: options.to,
			subject: options.subject,
			text: options.text || '',
			html: options.html || ''
		});
		console.log(`[Email] Sent to ${options.to}: "${options.subject}"`);
		return { sent: true };
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		console.error(`[Email] Failed to send to ${options.to}:`, msg);
		return { sent: false, error: msg };
	}
}

/**
 * Send password reset email.
 */
export async function sendPasswordResetEmail(to: string, resetLink: string, appName: string): Promise<{ sent: boolean; error?: string }> {
	return sendEmail({
		to,
		subject: `Reset Password - ${appName}`,
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
				<h2 style="color: #1a1a2e;">Reset Password</h2>
				<p>Kami menerima permintaan reset password untuk akun Anda.</p>
				<p>Klik tombol di bawah untuk mereset password:</p>
				<div style="text-align: center; margin: 32px 0;">
					<a href="${resetLink}"
						style="display: inline-block; padding: 12px 32px; background: #d4a574; color: #fff;
							   text-decoration: none; border-radius: 8px; font-weight: 600;">
						Reset Password
					</a>
				</div>
				<p style="color: #666; font-size: 14px;">Link ini berlaku selama 1 jam.</p>
				<p style="color: #666; font-size: 14px;">Jika Anda tidak meminta reset password, abaikan email ini.</p>
				<hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
				<p style="color: #999; font-size: 12px;">&copy; ${new Date().getFullYear()} ${appName}</p>
			</div>
		`,
		text: `
Reset Password - ${appName}

Kami menerima permintaan reset password untuk akun Anda.

Kunjungi link berikut untuk mereset password:
${resetLink}

Link ini berlaku selama 1 jam.

Jika Anda tidak meminta reset password, abaikan email ini.
		`.trim()
	});
}

/**
 * Send welcome / registration email.
 */
export async function sendWelcomeEmail(to: string, username: string, appName: string): Promise<{ sent: boolean; error?: string }> {
	return sendEmail({
		to,
		subject: `Selamat Datang di ${appName}!`,
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
				<h2 style="color: #1a1a2e;">Halo ${username}!</h2>
				<p>Selamat datang di <strong>${appName}</strong>.</p>
				<p>Akun Anda berhasil dibuat. Silakan login untuk mulai membuat undangan digital.</p>
				<div style="text-align: center; margin: 32px 0;">
					<a href="${resetLinkPlaceholder()}/login"
						style="display: inline-block; padding: 12px 32px; background: #d4a574; color: #fff;
							   text-decoration: none; border-radius: 8px; font-weight: 600;">
						Login Sekarang
					</a>
				</div>
				<hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
				<p style="color: #999; font-size: 12px;">&copy; ${new Date().getFullYear()} ${appName}</p>
			</div>
		`,
		text: `
Selamat Datang di ${appName}!

Halo ${username},

Akun Anda berhasil dibuat. Login untuk mulai membuat undangan digital.

${resetLinkPlaceholder()}/login
		`.trim()
	});
}

function resetLinkPlaceholder(): string {
	const origin = env.ORIGIN || 'http://localhost:3003';
	return origin;
}
