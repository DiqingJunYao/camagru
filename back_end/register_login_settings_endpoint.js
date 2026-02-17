import { db } from "./database.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

export function registerLoginSettingsEndpoint(fastify) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "nicolaswickens777@gmail.com",
      pass: "jqyjbvwyvpwfeayh",
    },
  });

  // password hashing
  fastify.post("/register", async (req, reply) => {
    const { username, password, email } = req.body;
    const saltRounds = 10;
    try {
      // hash the password with bcrypt
      const hash = await bcrypt.hash(password, saltRounds);
      // generate a random verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationLink = `https://localhost/verify?token=${verificationToken}`;
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

  fastify.post("/login", async (req, reply) => {
    const { username, password } = req.body;
    try {
      // find the user by username
      const [rows] = await db.execute(
        "SELECT * FROM users WHERE username = ?",
        [username],
      );
      if (rows.length === 0) {
        reply.status(404).send({ error: "User not found" });
        return;
      }
      const user = rows[0];
      // check if the password matches
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        reply.status(401).send({ error: "Invalid password" });
        return;
      }
      // if (!user.is_verified) {
      //   reply.status(403).send({ error: "Email not verified" });
      //   return;
      // }
      reply.send({ success: true, message: "Login successful" });
    } catch (err) {
      console.error("Error during login:", err);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  fastify.post("/forget-password", async (req, reply) => {
    const { username } = req.body;
    try {
      // find the user by username
      const [rows] = await db.execute(
        "SELECT * FROM users WHERE username = ?",
        [username],
      );
      if (rows.length === 0) {
        reply.status(404).send({ error: "User not found" });
        return;
      }
      const user = rows[0];
      // generate a temporary password
      const tempPassword = crypto.randomBytes(8).toString("hex");
      const saltRounds = 10;
      const hash = await bcrypt.hash(tempPassword, saltRounds);
      // update the user's password in the database
      await db.execute("UPDATE users SET password = ? WHERE id = ?", [
        hash,
        user.id,
      ]);
      // send the temporary password to the user's email
      await transporter.sendMail({
        from: '"Camagru" <no-reply@camagru.com>',
        to: user.email,
        subject: "Temporary Password",
        html: `Your temporary password is: <b>${tempPassword}</b>, please log in and change it immediately.
				 If you received this email by mistake, please ignore it.`,
      });
      reply.send({
        success: true,
        message: "Temporary password sent to your email",
      });
    } catch (err) {
      console.error("Error during forget password:", err);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  fastify.post("/get-user-info", async (req, reply) => {
    const { username } = req.body;
    try {
      const [rows] = await db.execute(
        "SELECT email FROM users WHERE username = ?",
        [username],
      );
      if (rows.length === 0) {
        reply.status(404).send({ error: "User not found" });
        return;
      }
      const user = rows[0];
      reply.send({ success: true, email: user.email });
    } catch (err) {
      console.error("Error fetching user info:", err);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  fastify.post("/update-settings", async (req, reply) => {
    const { currentUsername, currentEmail, username, email, password } =
      req.body;
    let id = null;
    try {
      const [rows] = await db.execute(
        "SELECT id FROM users WHERE username = ?",
        [currentUsername],
      );
      if (rows.length === 0) {
        reply.status(404).send({ error: "User not found" });
        return;
      }
      id = rows[0].id;
    } catch (err) {
      console.error("Error fetching user ID:", err);
      reply.status(500).send({ error: "Internal Server Error" });
      return;
    }

    try {
      if (username && username !== currentUsername && username.length > 0) {
        await db.execute("UPDATE users SET username = ? WHERE id = ?", [
          username,
          id,
        ]);
      }
      if (email && email !== currentEmail && email.length > 0) {
        await db.execute("UPDATE users SET email = ? WHERE id = ?", [
          email,
          id,
        ]);
      }
      if (password && password.length > 0) {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        await db.execute("UPDATE users SET password = ? WHERE id = ?", [
          hash,
          id,
        ]);
      }
      reply.send({ success: true, message: "Settings updated successfully" });
    } catch (err) {
      console.error("Error updating settings:", err);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}
