const Route = require("../../models/Route");
const graphService = require("../graph/graph.service");
const dijkstra = require("./dijkstra");

class RouteService {
  async optimizeRoute(start, end) {
    const graph = await graphService.buildGraph();

    if (!graph[start]) {
      throw new Error(
        `Start hub "${start}" not found in the route network. ` +
        `Ensure the hub has outgoing routes registered.`,
      );
    }
    if (!graph[end]) {
      throw new Error(
        `End hub "${end}" not found in the route network. ` +
        `Ensure the hub has outgoing routes registered.`,
      );
    }

    const result = dijkstra.findShortestPath(graph, start, end);

    if (!result.path || result.path.length < 2) {
      return null;
    }

    const routePairs = [];
    for (let i = 0; i < result.path.length - 1; i++) {
      routePairs.push({
        fromHub: result.path[i],
        toHub: result.path[i + 1],
      });
    }

    const routeDocs = await Route.find({
      $or: routePairs.map(pair => ({
        fromHub: pair.fromHub,
        toHub: pair.toHub,
        isBlocked: false,
      })),
    })
      .populate("fromHub", "name code")
      .populate("toHub", "name code")
      .lean();

    const routeMap = {};
    for (const doc of routeDocs) {
      const key = `${doc.fromHub._id}-${doc.toHub._id}`;
      routeMap[key] = doc;
    }
    const legs = [];
    let totalDistance = 0;
    let totalTravelTime = 0;
    let totalFuelCost = 0;

    for (let i = 0; i < result.path.length - 1; i++) {
      const fromId = result.path[i];
      const toId = result.path[i + 1];
      const key = `${fromId}-${toId}`;
      const routeDoc = routeMap[key];

      if (routeDoc) {
        legs.push({
          fromHub: routeDoc.fromHub,
          toHub: routeDoc.toHub,
          distance: routeDoc.distance,
          travelTime: routeDoc.travelTime,
          fuelCost: routeDoc.fuelCost,
          trafficLevel: routeDoc.trafficLevel,
        });
        totalDistance += routeDoc.distance;
        totalTravelTime += routeDoc.travelTime;
        totalFuelCost += routeDoc.fuelCost;
      }
    }

    return {
      path: result.path,
      legs,
      totalCost: result.totalCost,
      summary: {
        totalDistance,
        totalTravelTime,
        totalFuelCost,
        hubCount: result.path.length,
      },
    };
  }

  async recalculateRoute(start, end) {
    // Invalidate cached graph so fresh data is used
    await graphService.invalidateGraph();
    return this.optimizeRoute(start, end);
  }
}

module.exports = new RouteService();
