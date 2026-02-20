import fs from 'fs'
import path from 'path'
import { db } from "./database.js";


export async function uploadEndpoint(fastify) {
	fastify.post('/upload', { preHandler: [fastify.authenticate] }, async (req, reply) => {
		const data = await req.file()
		const { filename, file } = data
		const uploadDir = path.join(process.cwd(), 'uploads')
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir)
		}
		const filePath = path.join(uploadDir, filename)
		const writeStream = fs.createWriteStream(filePath)
		file.pipe(writeStream)

		writeStream.on('finish', () => {
			reply.send({ success: true, message: 'File uploaded successfully' })
			
		})

		writeStream.on('error', (err) => {
			console.error('Error uploading file:', err)
			reply.status(500).send({ error: 'Failed to upload file' })
		})
	})
}