const Hub = require("../../models/Hub");

exports.createHub = async (req, res) => {
  try {
    const hub = await Hub.create(req.body);
    res.status(201).json({ success: true, data: hub });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllHubs = async (req, res) => {
  try {
    const hubs = await Hub.find().sort({ name: 1 });
    res.json({ success: true, data: hubs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHubById = async (req, res) => {
  try {
    const hub = await Hub.findById(req.params.id);
    if (!hub) return res.status(404).json({ success: false, message: "Hub not found" });
    res.json({ success: true, data: hub });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
