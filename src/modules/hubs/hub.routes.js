const router = require("express").Router();
const controller = require("./hub.controller");
const auth = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const { hubSchema } = require("../../validations/hub.validation");

router.post("/", auth(["ADMIN", "DISPATCHER"]), validate(hubSchema), controller.createHub);
router.get("/", auth(), controller.getAllHubs);
router.get("/:id", auth(), controller.getHubById);

module.exports = router;
