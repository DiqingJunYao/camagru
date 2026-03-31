import { db } from "./database.js";
import fs from "fs";
import path from "path";
import { __dirname } from "./server.js";

export function deleteMyImg(fastify) {
  fastify.delete(
    "/delete_image/:filename",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const { filename } = request.params;
        const [rows] = await db.execute(
          "SELECT user_id FROM uploads WHERE filename = ?",
          [filename],
        );
        if (rows.length === 0) {
          return reply.status(404).send({ error: "Image not found" });
        }
        if (rows[0].user_id !== request.user.id) {
          return reply.status(403).send({ error: "Access denied" });
        }
        const filePath = path.join(__dirname, "../uploads", filename);
        fs.unlinkSync(filePath);
        await db.execute("DELETE FROM uploads WHERE filename = ?", [filename]);
        return reply.send({ success: true });
      } catch (err) {
        console.error("Error deleting image:", err);
        return reply.status(500).send({ error: "Failed to delete image" });
      }
    },
  );
}
