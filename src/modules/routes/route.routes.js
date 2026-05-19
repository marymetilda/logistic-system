const router = require("express").Router();
const controller = require("./route.controller");
const validate = require("../../middleware/validate.middleware");
const auth = require("../../middleware/auth.middleware");
const { optimizeSchema, createRouteSchema, trafficSchema, blockSchema } = require("../../validations/route.validation");

router.post("/", auth(["ADMIN", "DISPATCHER"]), validate(createRouteSchema), controller.createRoute);
router.post("/optimize", validate(optimizeSchema), controller.optimizeRoute);
router.post("/recalculate", validate(optimizeSchema), controller.recalculateRoute);
router.patch("/:routeId/block", auth(["ADMIN", "DISPATCHER"]), validate(blockSchema), controller.toggleBlockRoute);
router.patch("/:routeId/traffic", auth(["ADMIN", "DISPATCHER"]), validate(trafficSchema), controller.updateTraffic);

router.get("/cycles", controller.detectCycles);
router.get("/", controller.getAllRoutes);

module.exports = router;
