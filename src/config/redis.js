const redis = require("redis");

let client;
let isConnected = false;

const noop = {
  get: async () => null,
  setEx: async () => {},
  del: async () => {},
};

async function initRedis() {
  try {
    client = redis.createClient({ 
      url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
      socket: {
        connectTimeout: 5000,
        lazyConnect: false,
      },
    });
    
    client.on("error", (err) => {
      console.warn("Redis error:", err.message);
      isConnected = false;
    });
    
    await client.connect();
    isConnected = true;
    console.log("Redis connected successfully");
  } catch (err) {
    console.warn("Redis unavailable — graph caching disabled, falling back to DB queries:", err.message);
    client = null;
    isConnected = false;
  }
}

initRedis();

const safeClient = {
  get: async (key) => {
    if (!client || !isConnected) return null;
    try {
      return await client.get(key);
    } catch (err) {
      console.warn("Redis get error:", err.message);
      return null;
    }
  },
  setEx: async (key, seconds, value) => {
    if (!client || !isConnected) return;
    try {
      await client.setEx(key, seconds, value);
    } catch (err) {
      console.warn("Redis setEx error:", err.message);
    }
  },
  del: async (key) => {
    if (!client || !isConnected) return;
    try {
      await client.del(key);
    } catch (err) {
      console.warn("Redis del error:", err.message);
    }
  },
};

module.exports = safeClient;
