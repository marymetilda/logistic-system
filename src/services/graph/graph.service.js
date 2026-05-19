const Route = require("../../models/Route");
const redis = require("../../config/redis");

class GraphService {
  constructor() {
    this.memoryCache = null;
    this.memoryCacheExpiry = null;
  }

  async buildGraph() {
    const cached = await redis.get("GRAPH");

    if (cached) {
      return JSON.parse(cached);
    }

    if (this.memoryCache && this.memoryCacheExpiry > Date.now()) {
      return this.memoryCache;
    }

    const routes = await Route.find({}).lean();

    const graph = {};
    let edgeCount = 0;

    for (const route of routes) {
      if (route.isBlocked) {
        continue;
      }

      const trafficPenality =
        route.trafficLevel === "LOW"
          ? 1
          : route.trafficLevel === "MEDIUM"
            ? 5
            : 10;

      const weight =
        route.distance * 0.4 +
        route.travelTime * 0.3 +
        route.fuelCost * 0.2 +
        trafficPenality * 0.1;

      const from = String(route.fromHub);
      const to = String(route.toHub);

      if (!graph[from]) graph[from] = [];
      if (!graph[to]) graph[to] = [];

      graph[from].push({ node: to, weight });
      edgeCount++;
    }

    await redis.setEx("GRAPH", 300, JSON.stringify(graph));

    this.memoryCache = graph;
    this.memoryCacheExpiry = Date.now() + 300000;

    return graph;
  }

  async invalidateGraph() {
    await redis.del("GRAPH");
    this.memoryCache = null;
    this.memoryCacheExpiry = null;
  }
}

module.exports = new GraphService();
