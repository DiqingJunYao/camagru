import mysql from "mysql2/promise";

// clean the database when people don't verify their email within 6 hours
async function cleanupUnverifiedUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "camagru",
  });
  const [result] = await connection.execute(`
    DELETE FROM users
    WHERE is_verified = FALSE
      AND created_at < NOW() - INTERVAL 2 DAY
  `);
  console.log("Deleted unverified users:", result.affectedRows);
  await connection.end();
}
setInterval(cleanupUnverifiedUsers, 6 * 60 * 60 * 1000);