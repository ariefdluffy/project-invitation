module.exports = {
  apps: [
    {
      // ========================================
      // Application Name & Entry Point
      // ========================================
      name: 'project-invitation',
      script: './build/index.js',
      cwd: '/home/miftah/project-invitation',

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
      // 512MB untuk production
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
      'post-deploy': 'npm install && npm run build && pm2 restart wedding-invitation',
      'pre-deploy-local': 'echo "Deploying to production"'
    }
  }
};
