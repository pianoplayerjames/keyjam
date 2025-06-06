// backend/src/index.ts
import Fastify from 'fastify';

const fastify = Fastify({
  logger: true // Use true for development logging
});

// Declare a route
fastify.get('/api', async (request, reply) => {
  return { hello: 'world' };
});

// Start the server
const start = async () => {
  try {
    // Must listen on host 0.0.0.0 for Docker
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();