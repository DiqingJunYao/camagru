const app = require("fastify")({ logger: true });
const path = require("path");
const fastifyStatic = require("fastify-static");

app.register(fastifyStatic, {
  root: path.join(__dirname, "front_end"),
  prefix: "/",
});

app.get("/", (request, reply) => {
  reply.type("text/html").sendFile("index.html");
});

const startServer = async () => {
  try {
    await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0",
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();
