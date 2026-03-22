import { db } from "./database.js";

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
        console.log("error here 1");
        console.error("Error fetching imgID:", err);
        rep.status(500).send({ error: "Internal Server Error" });
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
        console.log("error here 2");
        console.error("Error fetching userID:", err);
        rep.status(500).send({ error: "Internal Server Error" });
        return;
      }

      console.log(
        "the imgId: ",
        imgId,
        "the userid",
        userId,
        "the comments: ",
        context,
      );
      try {
        await db.execute(
          "INSERT INTO comments (user_id, upload_id, comment_text) VALUES (?, ?, ?)",
          [userId, imgId, context],
        );
        rep.status(200).send({
          success: true,
          message: "User upload comments successfully",
        });
      } catch (err) {
        console.log("error here 3");
        console.error("Error inserting comments:", err);
        rep.status(500).send({ error: "Internal Server Error" });
        return;
      }
    },
  );
}
