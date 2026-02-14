const path = require('path');
const fastify = require('fastify')({ logger: true });
const fastifyStatic = require('@fastify/static');

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'front_end'),
  prefix: '/', 
});

fastify.get('/', (req, reply) => {
  reply.sendFile('index.html');
});

const port = Number(process.env.PORT) || 3000;
fastify.listen({ port, host: '0.0.0.0' });
