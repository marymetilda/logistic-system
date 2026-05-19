const Route = require("../../models/Route");

exports.topFastest = async (req, res) => {
  try {
    const routes = await Route.find({ isBlocked: false })
      .sort({ travelTime: 1 })
      .limit(5)
      .lean();

    res.json({ success: true, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.trafficDistribution = async (req, res) => {
  try {
    const distribution = await Route.aggregate([
      { $group: { _id: "$trafficLevel", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, data: distribution });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.routeStatusSummary = async (req, res) => {
  try {
    const summary = await Route.aggregate([
      {
        $group: {
          _id: "$isBlocked",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
