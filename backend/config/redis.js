const memoryStore = new Map();

const mockRedisClient = {
  on: (event, cb) => {},
  
  connect: async () => { 
    console.log('Mock Redis connected (In-Memory mode active)'); 
  },
  
  setEx: async (key, ttl, value) => {
    memoryStore.set(key, value);
    setTimeout(() => {
      memoryStore.delete(key);
    }, ttl * 1000);
  },
  
  get: async (key) => {
    return memoryStore.get(key) || null;
  },
  
  del: async (key) => {
    memoryStore.delete(key);
  }
};

const connectRedis = async () => {
  await mockRedisClient.connect();
};

module.exports = { redisClient: mockRedisClient, connectRedis };