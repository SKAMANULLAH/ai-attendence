// PM2 Ecosystem Configuration for AWS EC2 Deployment
// Run on EC2: pm2 start backend/ecosystem.config.js

module.exports = {
  apps: [
    {
      name: "snap-ai-api",
      script: "python3",
      args: "-m uvicorn backend.server:app --host 0.0.0.0 --port 8000 --workers 2",
      cwd: "/var/www/snap-ai", // Or your project path on EC2 (e.g. ~/snap-ai)
      interpreter: "none",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "600M",
      env: {
        PORT: 8000,
        ENVIRONMENT: "production",
        DOMAIN: "snap-ai.online"
      }
    }
  ]
};
