const Route = require("../../models/Route");
const redis = require("../../config/redis");

class GraphService {
  async buildGraph() {
    const cached = await redis.get("GRAPH");

    if (cached) return JSON.parse(cached);

     const routes = await Route.find({}).lean();
     const graph = {};

     for (const route of routes) {
       if (route.isBlocked) continue;

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

       // Ensure both from and to nodes exist in the graph
       if (!graph[from]) graph[from] = [];
       if (!graph[to]) graph[to] = [];

       graph[from].push({
         node: to,
         weight,
       });
     }

    await redis.setEx("GRAPH", 300, JSON.stringify(graph));

    return graph;
  }

  async invalidateGraph() {
    await redis.del("GRAPH");
  }
}

module.exports = new GraphService();
