import { db } from "./database.js";

export function storeLikes(fastify) {
  fastify.post(
    "/like_card",
    { preHandler: [fastify.authenticate] },
    async (req, rep) => {
      const { fileName } = req.body;
      if (!fileName || fileName === "") {
        rep.status(404).send("fileName or context error");
        return;
      }

      let imgId = null;
      let userId = null;

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
        await db.execute(
          "INSERT INTO likes (user_id, upload_id) VALUES (?, ?)",
          [userId, imgId],
        );
        rep.status(200).send({
          success: true,
          message: "User like img successfully",
        });
      } catch (err) {
        console.error("Error like imgs:", err);
        rep.status(400).send({ error: err });
        return;
      }
    },
  );
}
