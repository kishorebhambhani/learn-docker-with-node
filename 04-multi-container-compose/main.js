const express = require('express');
const { createClient } = require('redis');

const app = express();

const PORT = process.env.PORT || 8000;

// Where is Redis? Inside Docker Compose, the answer is the SERVICE NAME
// from docker-compose.yml ("redis"). Compose runs a tiny DNS server on the
// project's network, so the hostname "redis" resolves to the Redis container.
//
// Note: "localhost" would NOT work inside a container. Inside the app
// container, localhost means "this very container" — and Redis isn't in it.
// We default to localhost only so the app can still be run on your own
// machine against a Redis that is also running on your own machine.
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);

const redis = createClient({ socket: { host: REDIS_HOST, port: REDIS_PORT } });

// The Redis client reports connection problems as "error" events. Without
// a listener Node would crash. With one, the client keeps retrying quietly,
// which also covers the case where the app starts a moment before Redis.
redis.on('error', (err) => {
  console.error(`Redis error (${REDIS_HOST}:${REDIS_PORT}): ${err.message}`);
});

app.get('/', async (req, res) => {
  // INCR adds 1 to a counter stored in Redis and returns the new value.
  // The count lives in the Redis container, not in this app's memory.
  const visits = await redis.incr('visits');
  res.json({
    message: 'Hello from inside a Docker container! - 04-multi-container-compose',
    visits,
  });
});

async function start() {
  await redis.connect();
  console.log(`Connected to Redis at ${REDIS_HOST}:${REDIS_PORT}`);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start();
