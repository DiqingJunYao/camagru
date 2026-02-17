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
import fastifyStatic from "@fastify/static";

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../front_end"),
});

fastify.get("/", (req, reply) => {
  reply.sendFile("index.html");
});

import { registerLoginSettingsEndpoint } from "./register_login_settings_endpoint.js";

registerLoginSettingsEndpoint(fastify);


fastify.listen({ port: 4000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
