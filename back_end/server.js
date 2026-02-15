import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import Fastify from "fastify";
const fastify = Fastify();
import fastifyStatic from "@fastify/static";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../front_end'),
});

fastify.get("/", (req, reply) => {
  reply.sendFile("index.html");
});

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "camagru",
});

// password hashing
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

const port = 4000;
fastify.listen({ port, host: "0.0.0.0" });
