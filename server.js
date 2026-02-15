const path = require("path");
const fastify = require("fastify")({ logger: true });
const fastifyStatic = require("@fastify/static");
const mysql = require("mysql2/promise");

// create a MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "camagru",
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "front_end"),
  prefix: "/",
});

fastify.get("/", (req, reply) => {
  reply.sendFile("index.html");
});
// password hashing
const bcrypt = require("bcrypt");
fastify.post("/register", async (req, reply) => {
  console.log("Received registration data: ", req.body);
  const { username, password, email } = req.body;
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log("Hashed Password:", hash);
    // insert user into database
    const [result] = await db.execute(
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
      [username, hash, email],
    );
    console.log("Database Insert Result:", result);
    reply
      .status(201)
      .send({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Error hashing password:", err);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

const port = Number(process.env.PORT) || 4000;
fastify.listen({ port, host: "0.0.0.0" });
