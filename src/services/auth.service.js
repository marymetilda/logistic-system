const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

class AuthService {
  async register(email, password, role = "VIEWER") {
    const hashed = await bcrypt.hash(password, 10);
    return User.create({ email, password: hashed, role });
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    return { token };
  }
}

module.exports = new AuthService();
