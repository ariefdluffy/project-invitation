module.exports = {
  apps: [
    {
      // ========================================
      // Application Configuration
      // ========================================
      name: 'wedding-invitation',
      script: 'npm',
      args: 'run dev',  // Use dev server, not production build
      cwd: '/home/miftah/wedding-invitation',  // Current server path
      
      // ========================================
      // Environment Variables
      // ========================================
      env: {
        NODE_ENV: 'development',
        PORT: 3003,
        HOST: '0.0.0.0',
      },
      
      // ========================================
      // Single Instance (not clustering)
      // ========================================
      // Untuk development/staging di server Hermes Agent
      // Gunakan single instance aja, tidak perlu clustering
      instances: 1,
      exec_mode: 'fork',
      
      // ========================================
      // Logging
      // ========================================
      error_file: '/home/miftah/.pm2/logs/wedding-invitation-error.log',
      out_file: '/home/miftah/.pm2/logs/wedding-invitation-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // ========================================
      // Auto-Restart Policies
      // ========================================
      autorestart: true,
      max_restarts: 10,
      min_uptime: '30s',
      
      // ========================================
      // Memory Management
      // ========================================
      // Server ini punya ~1GB available, jadi batasnya lebih longgar
      max_memory_restart: '600M',
      
      // ========================================
      // Timeout Configuration
      // ========================================
      listen_timeout: 10000,
      kill_timeout: 5000,
      
      // ========================================
      // Watch for file changes (development)
      // ========================================
      // Enable watch mode untuk auto-restart saat code berubah
      watch: ['src'],
      ignore_watch: ['node_modules', 'dist', 'build', '.svelte-kit'],
      
      // ========================================
      // Node.js Options
      // ========================================
      node_args: '--max-old-space-size=512',  // 512MB heap untuk dev
      
      // ========================================
      // Other Options
      // ========================================
      wait_ready: false,
      max_finishes: 30,
    }
  ]
};
