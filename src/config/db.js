const mysql = require('mysql2/promise');
require('dotenv').config();

// Initialize the Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10, // Optimal for most small to medium APIs
  queueLimit: 0
});

// Self-executing robust connection test
pool.getConnection()
  .then((connection) => {
    console.log('✅ Connected successfully to the MySQL Database (portfolio_db).');
    connection.release(); // Release the pool back to query requests
  })
  .catch((err) => {
    console.error('❌ Failed to establish a database connection:');
    console.error(`Reason: ${err.message}`);
    // If you prefer to crash the app totally rather than starting with a dead DB:
    // process.exit(1);
  });

module.exports = pool;
