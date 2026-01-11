const app = require('./src/app');
const { initDatabase } = require('./src/utils/db');
const { PORT, SMTP_USER } = require('./src/config/env');

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📧 Email service: ${SMTP_USER ? 'Configured' : 'Not configured (using mock)'}`);
    console.log(`🗄️  Database: MySQL`);
  });
}).catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});
