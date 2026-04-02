import { db } from "./database.js";
import nodemailer from "nodemailer";
import { transporter } from "./register_login_settings_endpoint.js";

export function storeComments(fastify) {
  fastify.post(
    "/add_comment",
    { preHandler: [fastify.authenticate] },
    async (req, rep) => {
      const { fileName, context } = req.body;
      if (!fileName || fileName === "" || !context || context === "") {
        rep.status(404).send("fileName or context error");
        return;
      }

      let imgId = null;
      let imgOwnerId = null;
      let imgOwnerEmail = null;
      let userId = null;
      let sendEmail = false;

      try {
        const [rows] = await db.execute(
          "SELECT id FROM uploads WHERE filename = ?",
          [fileName],
        );
        if (rows.length === 0) {
          rep.status(404).send({ error: "Img id not found" });
          return;
        }
        imgId = rows[0].id;
      } catch (err) {
        console.error("Error fetching imgID:", err);
        rep.status(400).send({ error: err });
        return;
      }

      try {
        const [rows] = await db.execute(
          "SELECT user_id FROM uploads WHERE filename = ?",
          [fileName],
        );
        if (rows.length === 0) {
          rep.status(404).send({ error: "Img id not found" });
          return;
        }
        imgOwnerId = rows[0].user_id;
      } catch (err) {
        console.error("Error fetching imgID:", err);
        rep.status(400).send({ error: err });
        return;
      }

      try {
        const [rows] = await db.execute(
          "SELECT id FROM users WHERE username = ?",
          [req.user.username],
        );
        if (rows.length === 0) {
          rep.status(404).send({ error: "User id not found" });
          return;
        }
        userId = rows[0].id;
      } catch (err) {
        console.error("Error fetching userID:", err);
        rep.status(400).send({ error: err });
        return;
      }

      try {
        const [rows] = await db.execute(
          "SELECT email FROM users WHERE id = ?",
          [imgOwnerId],
        );
        if (rows.length === 0) {
          rep.status(404).send({ error: "User id not found" });
          return;
        }
        imgOwnerEmail = rows[0].email;
      } catch (err) {
        console.error("Error fetching userID:", err);
        rep.status(400).send({ error: err });
        return;
      }

      try {
        const [rows] = await db.execute(
          "SELECT is_send_comment_email FROM users WHERE id = ?",
          [imgOwnerId],
        );
        if (rows.length === 0) {
          rep.status(404).send({ error: "User id not found" });
          return;
        }

        sendEmail = rows[0].is_send_comment_email === 1 ? true : false;
      } catch (err) {
        console.error("Error fetching userID:", err);
        rep.status(400).send({ error: err });
        return;
      }

      try {
        await db.execute(
          "INSERT INTO comments (user_id, upload_id, comment_text) VALUES (?, ?, ?)",
          [userId, imgId, context],
        );
      } catch (err) {
        console.error("Error inserting comments:", err);
        rep.status(400).send({ error: err });
        return;
      }

      try {
        if (sendEmail) {
          await transporter.sendMail({
            from: '"Camagru" <no-reply@camagru.com>',
            to: imgOwnerEmail,
            subject: "Someone leave a comment under your picture",
            html: `User ${req.user.username} leave a comment for you.<br>
            This is what he said: ${context}`,
          });
        }

        rep.status(200).send({
          success: true,
          message: "User upload comments successfully",
        });
      } catch (err) {
        console.error("Error inserting comments:", err);
        rep.status(400).send({ error: err });
        return;
      }
    },
  );
}
