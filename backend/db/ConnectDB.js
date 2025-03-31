const mysql = require("mysql2/promise");

const ConnectDB = async () => {
  try {
    const pool = await mysql.createPool({
      host: process.env.DB_HOST || "host.docker.internal", // Change to 'db' if using Docker
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "qwerty",
      database: process.env.DB_DATABASE || "my_new_db",
      waitForConnections: process.env.DB_WAITFORCONNECTIONS === "true",
      connectionLimit: Number(process.env.DB_CONNECTIONLIMIT) || 10,
      queueLimit: Number(process.env.DB_QUEUELIMIT) || 0,
    });

    console.log("✅ Connected to MySQL!");

    // Ensure the database exists
    await pool.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\``);
    console.log(`Database ${process.env.DB_DATABASE} created or already exists.`);

    // Ensure the correct database is being used
    await pool.query(`USE \`${process.env.DB_DATABASE}\``);
    console.log(`Switched to database ${process.env.DB_DATABASE}`);

    // Ensure the table exists
    await pool.query(`CREATE TABLE IF NOT EXISTS \`${process.env.DB_TABLENAME}\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log(`${process.env.DB_TABLENAME} table created or already exists.`);

    return pool;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = ConnectDB;
