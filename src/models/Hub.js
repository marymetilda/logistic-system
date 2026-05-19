const mongoose = require("mongoose");

const HubSchema = new mongoose.Schema(
  {
    name: { type: String, index: true },
    code: { type: String, unique: true, index: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Hub", HubSchema);
