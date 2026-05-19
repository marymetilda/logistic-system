const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema(
  {
    fromHub: { type: mongoose.Schema.Types.ObjectId, ref: "Hub", index: true },
    toHub: { type: mongoose.Schema.Types.ObjectId, ref: "Hub", index: true },
    distance: Number,
    travelTime: { type: Number, index: true },
    fuelCost: Number,
    trafficLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
      index: true,
    },
    isBlocked: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

RouteSchema.index({ fromHub: 1, toHub: 1, isBlocked: 1 });

module.exports = mongoose.model("Route", RouteSchema);
