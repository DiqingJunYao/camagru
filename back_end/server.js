import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import Fastify from "fastify";
export const fastify = Fastify();
import fastifyStatic from "@fastify/static";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../front_end"),
});

fastify.get("/", (req, reply) => {
  reply.sendFile("index.html");
});

// configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "nicolaswickens777@gmail.com",
    pass: "jqyjbvwyvpwfeayh",
  },
});

import { db } from "./database.js";
// password hashing
fastify.post("/register", async (req, reply) => {
  const { username, password, email } = req.body;
  const saltRounds = 10;
  try {
    // hash the password with bcrypt
    const hash = await bcrypt.hash(password, saltRounds);
    // generate a random verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationLink = `http://0.0.0.0:4000/verify?token=${verificationToken}`;
    // send verification email
    await transporter.sendMail({
      from: '"Camagru" <no-reply@camagru.com>',
      to: email,
      subject: "Please verify your account",
      html: `Click <a href="${verificationLink}">here</a> to verify your account.`,
    });
    // insert user into database
    const [result] = await db.execute(
      "INSERT INTO users (username, password, email, verification_token) VALUES (?, ?, ?, ?)",
      [username, hash, email, verificationToken],
    );
    console.log("Database Insert Result:", result);
    reply
      .status(201)
      .send({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Error:", err);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

fastify.get("/verify", async (req, reply) => {
  const { token } = req.query;
  try {
	// find the user with the given verification token
	const [rows] = await db.execute(
      "SELECT * FROM users WHERE verification_token = ?",
      [token],
    );
    if (rows.length === 0) {
      reply.status(404).send({ error: "Invalid verification token" });
      return;
    }
    const user = rows[0];
    // update the user's verified status
    await db.execute(
      "UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?",
      [user.id],
    );
    reply.send({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.error("Error verifying email:", err);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

const port = 4000;
fastify.listen({ port, host: "0.0.0.0" });
