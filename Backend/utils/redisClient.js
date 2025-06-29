// Redis utility for connecting and managing the Redis client
// Uses the 'redis' package
// Handles connection errors gracefully

import { createClient } from 'redis';

// Create a Redis client instance
const redisClient = createClient({
  // By default, connects to localhost:6379
  // To connect to a remote Redis, set the URL via environment variable
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
});

// Listen for error events and log them
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Connect to Redis (async, but we can await in main app if needed)
(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis successfully');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();

export default redisClient; 