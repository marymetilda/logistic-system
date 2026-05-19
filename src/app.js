const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "10kb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/hubs", require("./modules/hubs/hub.routes"));
app.use("/api/routes", require("./modules/routes/route.routes"));
app.use("/api/analytics", require("./modules/analytics/analytics.routes"));

app.use(require("./middleware/notFound.middleware"));

app.use(require("./middleware/error.middleware"));

module.exports = app;
