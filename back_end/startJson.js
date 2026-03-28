import { db } from "./database.js";

export function createJsonFile(fastify) {
  fastify.get("/start", async (req, rep) => {
    try {
      const [rows] = await db.execute(`
        SELECT
          u.id AS upload_id,
          u.filename,
          c.comment_text,
          usr.username
        FROM uploads u
        LEFT JOIN comments c ON c.upload_id = u.id
        LEFT JOIN users usr ON usr.id = c.user_id
        ORDER BY u.created_at DESC, c.created_at DESC
      `);

      const uploadsMap = new Map();

      for (const row of rows) {
        if (!uploadsMap.has(row.upload_id)) {
          uploadsMap.set(row.upload_id, {
            src: `/uploads/${row.filename}`,
            comments: [],
          });
        }

        if (row.comment_text) {
          uploadsMap.get(row.upload_id).comments.push({
            name: row.username,
            context: row.comment_text,
          });
        }
      }

      const resultObj = Object.fromEntries(
        Array.from(uploadsMap.values()).map((item, index) => [
          `image${index + 1}`,
          item,
        ]),
      );
      rep.status(200).send(resultObj);
    } catch (err) {
      console.error("Error start:", err);
      rep.status(500).send({ error: "Internal Server Error" });
    }
  });
}
