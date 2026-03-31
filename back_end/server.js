import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
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
  prefix: "/", // important
});
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import dotenv from "dotenv";
dotenv.config();
fastify.register(fastifyCookie);
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: "token",
    signed: false,
  },
});

fastify.decorate("authenticate", async function (request, reply) {
  try {
    const token = request.cookies.token;

    if (!token) {
      request.user = null;
      return;
    }

    const decoded = fastify.jwt.verify(token);
    request.user = decoded;
  } catch (err) {
    request.user = null;
  }
});
import fastifyMultipart from "@fastify/multipart";
fastify.register(fastifyMultipart);


fastify.get("/", (req, reply) => {
  reply.sendFile("index.html");
});

import { registerLoginSettingsEndpoint } from "./register_login_settings_endpoint.js";

registerLoginSettingsEndpoint(fastify);

import { uploadEndpoint } from "./upload.js"

uploadEndpoint(fastify);

import { storeComments } from "./storeComments.js";
storeComments(fastify);

import { storeLikes } from "./cardLikes.js";
storeLikes(fastify);

import { deleteLikes } from "./cardDislikes.js";
deleteLikes(fastify);

import { controlCommentEmail } from "./controlCommentEmail.js";
controlCommentEmail(fastify);

import { createJsonFile } from "./startJson.js";
createJsonFile(fastify);

import { combine } from "./combine.js";
combine(fastify);

import { getMyImg } from "./getMyImg.js";

getMyImg(fastify);

import { deleteMyImg } from "./deleteMyImg.js";

deleteMyImg(fastify);

import { normalFetch } from "./normalFetch.js";

normalFetch(fastify);

fastify.listen({ port: 4000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
