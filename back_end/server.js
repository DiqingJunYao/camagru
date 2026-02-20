import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import Fastify from "fastify";
const fastify = Fastify({
  https: {
    key: fs.readFileSync(path.join(process.cwd(), "server.key")),
    cert: fs.readFileSync(path.join(process.cwd(), "server.cert")),
  },
});

// register plugins
import fastifyStatic from "@fastify/static";
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../front_end"),
});
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
fastify.register(fastifyCookie);
fastify.register(fastifyJwt, {
  secret: `Dyao is the best!`,//TODO: use environment variable for secret in production
  cookie: {
    cookieName: "token",
    signed: false,
  }
});
fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized: Please login first!' })
  }
})
import fastifyMultipart from "@fastify/multipart";
fastify.register(fastifyMultipart);

import fsPromises from "fs/promises";

fastify.get("/", (req, reply) => {
  reply.sendFile("index.html");
});

import { registerLoginSettingsEndpoint } from "./register_login_settings_endpoint.js";

registerLoginSettingsEndpoint(fastify);


fastify.get("/test.json", async (req, reply) => {
  const data = await fsPromises.readFile("./test.json", "utf-8");
  const json = JSON.parse(data);
  reply.send(json);
});


fastify.listen({ port: 4000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
