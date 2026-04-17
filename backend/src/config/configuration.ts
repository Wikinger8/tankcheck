export default () => ({
  tankerkoenigApiKey: process.env.TANKERKOENIG_API_KEY,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  backendPort: parseInt(process.env.BACKEND_PORT || '3001', 10),
});
