import { db } from "./database.js";

export function getMyImg(fastify) {
  fastify.get(
    "/my_images",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const [rows] = await db.execute(
          "SELECT filename FROM uploads WHERE user_id = ? ORDER BY created_at DESC",
          [request.user.id],
        );
        const imageUrls = rows.map((row) => `/uploads/${row.filename}`);
        return reply.send({ success: true, images: imageUrls });
      } catch (err) {
        console.error("Error fetching user images:", err);
        return reply.status(500).send({ error: "Failed to load images" });
      }
    },
  );
}
