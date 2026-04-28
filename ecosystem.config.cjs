module.exports = {
  apps: [
    {
      // ========================================
      // Application Name & Entry Point
      // ========================================
      name: 'wedding-invitation',
      script: 'npm',
      args: 'run dev',
      cwd: '/home/miftah/wedding-invitation',
      
      // ========================================
      // Environment Variables
      // ========================================
      env: {
        NODE_ENV: 'development',
        PORT: 3003,
        HOST: '0.0.0.0',
      },
      
      // ========================================
      // Single Instance for Development
      // ========================================
      instances: 1,
      exec_mode: 'fork',
      
      // ========================================
      // Logging Configuration (use home directory)
      // ========================================
      error_file: '/home/miftah/.pm2/logs/wedding-invitation-error.log',
      out_file: '/home/miftah/.pm2/logs/wedding-invitation-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // ========================================
      // Memory Management
      // ========================================
      // 600MB for development mode
      max_memory_restart: '600M',
      
      // ========================================
      // Timeout Configuration
      // ========================================
      listen_timeout: 10000,
      kill_timeout: 5000,
      
      // ========================================
      // Watch for file changes
      // ========================================
      watch: ['src'],
      ignore_watch: ['node_modules', 'dist', 'build', '.svelte-kit'],
      
      // ========================================
      // Node.js Specific Options
      // ========================================
      node_args: '--max-old-space-size=512',
      
      // ========================================
      // Health Check (optional)
      // ========================================
      // listen_timeout: jika app tidak listen dalam 10s, dianggap fail
      wait_ready: false,
      
      // ========================================
      // Graceful Shutdown
      // ========================================
      // Tunggu hingga 10s untuk graceful shutdown sebelum force kill
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
      repo: 'https://github.com/your-repo/wedding-invitation.git',
      path: '/opt/wedding-invitation',
      'post-deploy': 'npm install && npm run build && pm2 restart wedding-invitation-prod',
      'pre-deploy-local': 'echo "Deploying to production"'
    }
  }
};
