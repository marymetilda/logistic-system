const routeService = require("../../services/routeEngine/route.service");
const graphService = require("../../services/graph/graph.service");
const cycleService = require("../../services/graph/cycle.service");
const Route = require("../../models/Route");

exports.createRoute = async (req, res) => {
  try {
    const { fromHub, toHub, distance, travelTime, fuelCost, trafficLevel, isBlocked } = req.body;

    const route = await Route.create({
      fromHub,
      toHub,
      distance,
      travelTime,
      fuelCost,
      trafficLevel: trafficLevel || "LOW",
      isBlocked: isBlocked || false,
    });

    await graphService.invalidateGraph();

    res.status(201).json({ success: true, data: route, message: "Route created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.optimizeRoute = async (req, res) => {
  try {
    const { start, end } = req.body;
    const result = await routeService.optimizeRoute(start, end);
    if (!result) {
      return res.status(200).json({ success: true, data: null, message: "No data" });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.recalculateRoute = async (req, res) => {
  try {
    const { start, end } = req.body;
    const result = await routeService.recalculateRoute(start, end);
    if (!result) {
      return res.status(200).json({ success: true, data: null, message: "No data" });
    }
    res.json({ success: true, data: result, message: "Route recalculated with latest data" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleBlockRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { isBlocked } = req.body;

    const updated = await Route.findByIdAndUpdate(
      routeId,
      { isBlocked: isBlocked ?? true },
      { new: true },
    );

    if (!updated) return res.status(404).json({ success: false, message: "Route not found" });

    await graphService.invalidateGraph();

    res.json({ success: true, data: updated, message: `Route ${isBlocked ? "blocked" : "unblocked"} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTraffic = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { trafficLevel } = req.body;

    if (!["LOW", "MEDIUM", "HIGH"].includes(trafficLevel)) {
      return res.status(400).json({ success: false, message: "trafficLevel must be LOW, MEDIUM, or HIGH" });
    }

    const updated = await Route.findByIdAndUpdate(
      routeId,
      { trafficLevel },
      { new: true },
    );

    if (!updated) return res.status(404).json({ success: false, message: "Route not found" });

    await graphService.invalidateGraph();

    res.json({ success: true, data: updated, message: "Traffic conditions updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.detectCycles = async (req, res) => {
  try {
    const graph = await graphService.buildGraph();
    const result = cycleService.detectCycle(graph);

    res.json({
      success: true,
      data: result,
      message: result.hasCycle
        ? "Cyclic dependencies detected in the route network"
        : "No cyclic dependencies found",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().lean();
    res.json({ success: true, data: routes, message: "Routes retrieved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
