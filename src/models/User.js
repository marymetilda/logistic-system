const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["ADMIN", "DISPATCHER", "VIEWER"],
    default: "VIEWER",
  },
});

module.exports = mongoose.model("User", UserSchema);
