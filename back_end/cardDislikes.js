import { db } from "./database.js";

export function deleteLikes(fastify) {
  fastify.post(
	"/dislike_card",
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

	  try {
		await db.execute(
		  "DELETE FROM likes WHERE user_id = ? AND upload_id = ?",
		  [userId, imgId],
		);
		rep.status(200).send({
		  success: true,
		  message: "User dislike img successfully",
		});
	  } catch (err) {
		console.log("error here 3");
		console.error("Error like imgs:", err);
		rep.status(500).send({ error: "Internal Server Error" });
		return;
	  }
	},
  );
}
