const mockRedisClient = {
  on: (event, cb) => {},
  connect: async () => { console.log('Mock Redis connected'); },
  setEx: async (key, ttl, value) => {},
  get: async (key) => null,
  del: async (key) => {}
};

const connectRedis = async () => {
  await mockRedisClient.connect();
};

module.exports = { redisClient: mockRedisClient, connectRedis };
