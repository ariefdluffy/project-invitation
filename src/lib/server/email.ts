import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';
import { createLogger } from './logger';

const log = createLogger('Email');

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

	log.debug('Config loaded', { host: config.host, port: config.port });

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
			log.error('Transport verify failed', { message: err.message });
		} else {
			log.info('Transport ready', { success });
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
		html: emailLayout(`
			<h2 style="margin:0 0 8px;font-size:24px;color:#1a1a2e;font-weight:700;text-align:center;">Verifikasi Email</h2>
			<p style="margin:0 0 6px;font-size:15px;color:#555;line-height:1.6;">Hai, selamat!</p>
			<p style="margin:0 0 6px;font-size:15px;color:#555;line-height:1.6;">Akun <strong>${appName}</strong> berhasil dibuat.</p>
			<p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">Konfirmasi email dengan klik tombol di bawah:</p>
			<table width="100%" cellpadding="0" cellspacing="0">
				<tr>
					<td align="center" style="padding:0 0 24px;">
						<a href="${verifyLink}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#d4a574,#c4956a);color:#ffffff;text-decoration:none;border-radius:50px;font-size:15px;font-weight:600;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(212,165,116,0.35);">
							Verifikasi Email
						</a>
					</td>
				</tr>
			</table>
			<table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f5;border-radius:12px;">
				<tr>
					<td style="padding:14px 20px;font-size:13px;color:#888;line-height:1.5;">
						<strong style="color:#c4956a;">&#9432;</strong> Link ini berlaku <strong>24 jam</strong>.
						Jika tidak merasa daftar, abaikan email ini.
					</td>
				</tr>
			</table>
		`, appName),
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
		log.warn('SMTP not configured. Skipping email send.');
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
		log.info('Sent', { to: options.to, subject: options.subject });
		return { sent: true };
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		log.error('Failed to send', { to: options.to, error: msg });
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
		html: emailLayout(`
			<h2 style="margin:0 0 8px;font-size:24px;color:#1a1a2e;font-weight:700;text-align:center;">Reset Password</h2>
			<p style="margin:0 0 6px;font-size:15px;color:#555;line-height:1.6;">Kami menerima permintaan reset password akun <strong>${appName}</strong>.</p>
			<p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">Klik tombol di bawah untuk buat password baru:</p>
			<table width="100%" cellpadding="0" cellspacing="0">
				<tr>
					<td align="center" style="padding:0 0 24px;">
						<a href="${resetLink}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#d4a574,#c4956a);color:#ffffff;text-decoration:none;border-radius:50px;font-size:15px;font-weight:600;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(212,165,116,0.35);">
							Reset Password
						</a>
					</td>
				</tr>
			</table>
			<table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f5;border-radius:12px;">
				<tr>
					<td style="padding:14px 20px;font-size:13px;color:#888;line-height:1.5;">
						<strong style="color:#c4956a;">&#9432;</strong> Link ini berlaku <strong>1 jam</strong>.
						Jika tidak meminta reset, abaikan email ini.
					</td>
				</tr>
			</table>
		`, appName),
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
		html: emailLayout(`
			<h2 style="margin:0 0 8px;font-size:24px;color:#1a1a2e;font-weight:700;text-align:center;">Halo, ${username}! 👋</h2>
			<p style="margin:0 0 6px;font-size:15px;color:#555;line-height:1.6;">Selamat datang di <strong>${appName}</strong>.</p>
			<p style="margin:0 0 6px;font-size:15px;color:#555;line-height:1.6;">Akun Anda berhasil dibuat.</p>
			<p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">Mulai buat undangan digital sekarang:</p>
			<table width="100%" cellpadding="0" cellspacing="0">
				<tr>
					<td align="center" style="padding:0 0 8px;">
						<a href="${resetLinkPlaceholder()}/login" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#d4a574,#c4956a);color:#ffffff;text-decoration:none;border-radius:50px;font-size:15px;font-weight:600;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(212,165,116,0.35);">
							Login Sekarang
						</a>
					</td>
				</tr>
			</table>
		`, appName),
		text: `
Selamat Datang di ${appName}!

Halo ${username},

Akun Anda berhasil dibuat. Login untuk mulai membuat undangan digital.

${resetLinkPlaceholder()}/login
		`.trim()
	});
}

function originUrl(): string {
	return env.ORIGIN || 'http://localhost:3003';
}

function logoUrl(): string {
	return `${originUrl()}/favicon.png`;
}

function resetLinkPlaceholder(): string {
	return originUrl();
}

/**
 * Modern email layout wrapper with logo, card design, and footer.
 */
function emailLayout(content: string, appName: string): string {
	const logoSrc = logoUrl();
	const year = new Date().getFullYear();
	return `
<!DOCTYPE html>
<html lang="id">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="x-apple-disable-message-reformatting">
</head>
<body style="margin:0;padding:0;background:#f0ece6;font-family:'Segoe UI','Helvetica Neue',Arial,sans-serif;">
	<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ece6;">
		<tr>
			<td align="center" style="padding:40px 16px;">
				<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.07);">
					<tr>
						<td align="center" style="padding:48px 40px 12px;">
							<img src="${logoSrc}" alt="${appName}" width="72" height="72" style="display:block;border-radius:50%;border:4px solid #f5f0ea;" />
						</td>
					</tr>
					<tr>
						<td align="center" style="padding:0 40px 28px;">
							<div style="width:56px;height:3px;background:linear-gradient(90deg,#d4a574,#e8c9a0);border-radius:2px;"></div>
						</td>
					</tr>
					<tr>
						<td style="padding:0 40px 36px;">
							${content}
						</td>
					</tr>
					<tr>
						<td style="background:#faf8f5;padding:28px 40px;">
							<table width="100%" cellpadding="0" cellspacing="0">
								<tr>
									<td align="center" style="font-size:12px;color:#aaa;line-height:1.7;">
										<p style="margin:0 0 2px;font-weight:500;color:#c9b19a;">&copy; ${year} ${appName}</p>
										<p style="margin:0;">Email ini dikirim otomatis — jangan balas email ini.</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>
`;
}
