const { createClient } = require('redis');

// Connect to Redis using the URL provided in the environment/docker-compose
// Fallback to localhost for local dev without docker
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Connected to Redis Cache.'));

// Automatically connect when the module is required
(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Failed to connect to Redis during initialization', err);
    }
})();

module.exports = redisClient;
