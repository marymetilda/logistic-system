const router = require("express").Router();
const controller = require("./analytics.controller");
const auth = require("../../middleware/auth.middleware");

router.get("/fastest", auth(), controller.topFastest);

router.get("/traffic-distribution", auth(["ADMIN"]), controller.trafficDistribution);
router.get("/route-status", auth(["ADMIN"]), controller.routeStatusSummary);

module.exports = router;
