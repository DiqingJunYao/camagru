import { db } from "./database.js";
import sharp from "sharp";
import fs from "fs";

export function combine(fastify) {
  fastify.post(
    "/combine",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parts = await request.parts();
      let imageBuffer = null;
      let bgImgName = null;
      let topValue = null;
      let leftValue = null;
      for await (const part of parts) {
        if (part.type === "file") {
          imageBuffer = await part.toBuffer();
        } else {
          if (part.fieldname === "bgImgName") {
            bgImgName = part.value;
          } else if (part.fieldname === "topValue") {
            topValue = part.value;
          } else if (part.fieldname === "leftValue") {
            leftValue = part.value;
          }
        }
      }
      console.log("Received bgImgName:", bgImgName);
      console.log("Received topValue:", topValue);
      console.log("Received leftValue:", leftValue);
      if (
        !imageBuffer ||
        !bgImgName ||
        topValue === null ||
        leftValue === null || 
		imageBuffer.length === 0
      ) {
        return reply.status(400).send({ error: "Missing required fields" });
      }
      const bgImagePath = `./uploads/${bgImgName}`;
      const resultName = `combined-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      try {
        await sharp(bgImagePath)
          .composite([
            {
              input: imageBuffer,
              top: parseInt(topValue, 10),
              left: parseInt(leftValue, 10),
            },
          ])
          .toFile(`./uploads/${resultName}`);
		await db.execute(`INSERT INTO uploads (user_id, filename, original_name, mime_type) VALUES (?, ?, ?, ?)`, [
		  request.user.id,
		  resultName,
		  resultName,
		  "image/jpg",
		]);
      } catch (err) {
        console.error("Error combining images:", err);
        return reply.status(500).send({ error: "Failed to combine images" });
      }
      reply
        .status(200)
        .send({ success: true, message: "Image combined successfully" });
    },
  );
}
