import path from "path";
import fsPromises from "fs/promises";
import { __dirname } from "./server.js";

export function normalFetch(fastify) {
  fastify.get("/uploads/:filename", async (req, reply) => {
    try {
      const filePath = path.join(__dirname, "../uploads", req.params.filename);

      const file = await fsPromises.readFile(filePath);

      const ext = path.extname(filePath).toLowerCase();
      let contentType = "application/octet-stream";
      if (ext === ".png") contentType = "image/png";
      if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      if (ext === ".gif") contentType = "image/gif";

      reply.type(contentType).send(file);
    } catch (err) {
      reply.code(404).send({ error: "File not found" });
    }
  });
}
