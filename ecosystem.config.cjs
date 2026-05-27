const path = require("path");

// Load .env file dengan cara yang lebih reliable
const fs = require("fs");
const envPath = path.join(__dirname, ".env");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        const value = valueParts.join("=").replace(/^["']|["']$/g, "");
        process.env[key.trim()] = value.trim();
      }
    }
  });
  console.log("[PM2] Environment file loaded from:", envPath);
} else {
  console.warn("[PM2] Warning: .env file not found at", envPath);
}

module.exports = {
  apps: [
    {
      name: "project-invitation",
      // Gunakan path absolut bun - cek dengan 'which bun' di server
      // Ganti sesuai hasil 'which bun' di server kamu
      script: process.env.BUN_PATH || '/home/miftah/.bun/bin/bun',
      args: "./build/index.js",
      // Gunakan __dirname agar path otomatis mengikuti lokasi ecosystem.config.cjs
      cwd: __dirname,

      // Environment File
      env_file: path.join(__dirname, ".env"),

      // ========================================
      // Environment Variables
      // ========================================
      env: {
        NODE_ENV: "production",
        PORT: 3003,
        HOST: "0.0.0.0",
        // Teruskan semua env vars penting ke child process
        SITE_KEY: process.env.SITE_KEY,
        SECRET_KEY: process.env.SECRET_KEY,
        PUBLIC_TURNSTILE_SITE_KEY: process.env.PUBLIC_TURNSTILE_SITE_KEY,
        TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
        SESSION_SECRET: process.env.SESSION_SECRET,
        UPLOADS_SIGNING_SECRET: process.env.UPLOADS_SIGNING_SECRET,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        ORIGIN: process.env.ORIGIN,
        ADMIN_USERNAME: process.env.ADMIN_USERNAME,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
      },

      // ========================================
      // Single Instance for Production
      // ========================================
      instances: 1,
      exec_mode: "fork",

      // ========================================
      // Logging Configuration
      // ========================================
      error_file: "/home/miftah/.pm2/logs/project-invitation-error.log",
      out_file: "/home/miftah/.pm2/logs/project-invitation-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // ========================================
      // Memory Management
      // ========================================
      max_memory_restart: "512M",

      // ========================================
      // Timeout Configuration
      // ========================================
      listen_timeout: 15000,
      kill_timeout: 5000,

      // ========================================
      // Bun Runtime (tidak perlu node_args)
      // ========================================
      // node_args tidak dipakai saat menggunakan Bun

      // ========================================
      // Health Check
      // ========================================
      wait_ready: true,
      health_check_grace_period: 3000,

      // ========================================
      // Graceful Shutdown
      // ========================================
      max_finishes: 30,
    },
  ],

  // ========================================
  // Deploy Configuration (untuk PM2 deploy)
  // ========================================
  deploy: {
    production: {
      user: "miftah",
      host: "production-server-ip",
      ref: "origin/main",
      repo: "https://github.com/your-repo/project-invitation.git",
      path: "/opt/project-invitation",
      "post-deploy":
        "bun install && bun run build && pm2 restart project-invitation",
      "pre-deploy-local": 'echo "Deploying to production"',
    },
  },
};
