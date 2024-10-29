import mysql from 'mysql2/promise';

export const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5, // Reduced connection limit to prevent ER_CON_COUNT_ERROR
  waitForConnections: true, // Queue requests when no connections are available
  queueLimit: 0, // Unlimited queue size
  enableKeepAlive: true, // Enable keep-alive to prevent stale connections
  keepAliveInitialDelay: 10000, // Keep-alive ping interval in milliseconds
});
