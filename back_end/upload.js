import fs from "fs";
import path from "path";
import { __dirname } from "./server.js";
import { pipeline } from "stream/promises";
import { db } from "./database.js";

export async function uploadEndpoint(fastify) {
  fastify.post(
    "/upload",
    { preHandler: [fastify.authenticate] },
    async (req, reply) => {
    const data = await req.file();
    if (!data || !data.file) {
      return reply.status(400).send({ error: "No file provided" });
    }

    const uploadDir = path.resolve(__dirname, "..", "uploads");
    await fs.promises.mkdir(uploadDir, { recursive: true });

    const safeName = path.basename(data.filename || "");
    const filename = safeName || `upload-${Date.now()}`;
    const uploadPath = path.join(uploadDir, filename);

    try {
      await pipeline(data.file, fs.createWriteStream(uploadPath, { flags: "wx" }));
      const sizeBytes =
        typeof data.file.bytesRead === "number" ? data.file.bytesRead : null;
      await db.execute(
        "INSERT INTO uploads (user_id, filename, original_name, mime_type, size_bytes) VALUES (?, ?, ?, ?, ?)",
        [req.user.id, filename, filename, data.mimetype || null, sizeBytes],
      );
      return reply.send({ success: true, message: "File uploaded successfully" });
    } catch (err) {
      if (err && err.code === "EEXIST") {
        return reply.status(409).send({ error: "File already exists" });
      }
      console.error("Error uploading file:", err);
      return reply.status(500).send({ error: "Failed to upload file" });
    }
  });
}
