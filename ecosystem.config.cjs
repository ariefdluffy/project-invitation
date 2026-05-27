const path = require('path');

// Load .env file dengan cara yang lebih reliable
const fs = require('fs');
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key.trim()] = value.trim();
      }
    }
  });
  console.log('[PM2] Environment file loaded from:', envPath);
} else {
  console.warn('[PM2] Warning: .env file not found at', envPath);
}

module.exports = {
  apps: [
    {
      // ========================================
      // Application Name & Entry Point
      // ========================================
      name: 'project-invitation',
      script: './build/index.js',
      cwd: '/var/www/project-invitation',

      // ========================================
      // Environment File (Cara PM2 membaca .env)
      // ========================================
      env_file: '/var/www/project-invitation/.env',

      // ========================================
      // Environment Variables
      // ========================================
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
        HOST: '0.0.0.0',
      },

      // ========================================
      // Single Instance for Production
      // ========================================
      instances: 1,
      exec_mode: 'fork',

      // ========================================
      // Logging Configuration
      // ========================================
      error_file: '/home/miftah/.pm2/logs/project-invitation-error.log',
      out_file: '/home/miftah/.pm2/logs/project-invitation-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // ========================================
      // Memory Management
      // ========================================
      max_memory_restart: '512M',

      // ========================================
      // Timeout Configuration
      // ========================================
      listen_timeout: 15000,
      kill_timeout: 5000,

      // ========================================
      // Node.js Specific Options
      // ========================================
      node_args: '--max-old-space-size=384',

      // ========================================
      // Health Check
      // ========================================
      wait_ready: true,
      health_check_grace_period: 3000,

      // ========================================
      // Graceful Shutdown
      // ========================================
      max_finishes: 30,
    }
  ],

  // ========================================
  // Deploy Configuration (untuk PM2 deploy)
  // ========================================
  deploy: {
    production: {
      user: 'miftah',
      host: 'production-server-ip',
      ref: 'origin/main',
      repo: 'https://github.com/your-repo/project-invitation.git',
      path: '/opt/project-invitation',
      'post-deploy': 'npm install && npm run build && pm2 restart project-invitation',
      'pre-deploy-local': 'echo "Deploying to production"'
    }
  }
};
