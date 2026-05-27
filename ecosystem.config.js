module.exports = {
  apps: [
    {
      // ========================================
      // Application Name & Entry Point
      // ========================================
      name: 'wedding-invitation-prod',
      script: 'node',
      args: 'build/index.js',
      cwd: '/opt/wedding-invitation',
      
      // ========================================
      // Environment Variables
      // ========================================
      // Load dari .env.production file
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
        HOST: '0.0.0.0',
      },
      
      // ========================================
      // Clustering (untuk multi-core utilization)
      // ========================================
      // instances: '2' = gunakan 2 CPU cores
      // instances: 'max' = gunakan semua available cores
      instances: '2',
      exec_mode: 'cluster',
      
      // ========================================
      // Logging Configuration
      // ========================================
      error_file: '/var/log/wedding-invitation/error.log',
      out_file: '/var/log/wedding-invitation/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // ========================================
      // Auto-Restart Policies
      // ========================================
      // autorestart: true = auto restart jika crash
      // max_restarts: 10 = stop jika crash 10x dalam periode
      // min_uptime: 30s = harus running minimal 30s, jika crash <30s dihitung
      autorestart: true,
      max_restarts: 10,
      min_uptime: '30s',
      
      // ========================================
      // Memory Management
      // ========================================
      // Jika process menggunakan > 400MB RAM, auto-restart
      // Sesuaikan dengan server memory availability
      max_memory_restart: '400M',
      
      // ========================================
      // Timeout Configuration
      // ========================================
      // listen_timeout: berapa lama menunggu app listen di port
      // kill_timeout: berapa lama menunggu sebelum force kill saat restart
      listen_timeout: 10000,
      kill_timeout: 5000,
      
      // ========================================
      // Watch & Reload (untuk development, disable di production)
      // ========================================
      // watch: false = jangan auto-reload file changes
      watch: false,
      
      // ========================================
      // Node.js Specific Options
      // ========================================
      node_args: '--max-old-space-size=1024',  // Allocate up to 1GB heap
      
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
