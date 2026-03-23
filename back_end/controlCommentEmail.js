import { db } from "./database.js";

export function controlCommentEmail(fastify) {
  fastify.get(
    "/open_comment_email",
    { preHandler: [fastify.authenticate] },
    async (req, rep) => {
      const username = req.user.username;
      try {
        await db.execute(
          "UPDATE users SET is_send_comment_email = ? WHERE username = ?",
          [1, username],
        );
        rep
          .status(200)
          .send({ success: true, message: "Open comment email successful." });
      } catch (err) {
        console.error("Error opening comment email:", err);
        rep.status(500).send({ error: "Internal Server Error" });
        return;
      }
    },
  );

  fastify.get(
    "/close_comment_email",
    { preHandler: [fastify.authenticate] },
    async (req, rep) => {
      const username = req.user.username;
      try {
        await db.execute(
          "UPDATE users SET is_send_comment_email = ? WHERE username = ?",
          [0, username],
        );
        rep
          .status(200)
          .send({ success: true, message: "Close comment email successful." });
      } catch (err) {
        console.error("Error closing comment email:", err);
        rep.status(500).send({ error: "Internal Server Error" });
        return;
      }
    },
  );
}
