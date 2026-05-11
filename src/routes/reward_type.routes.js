const router = require("express").Router();

const controller = require("../controllers/reward_type.controller");

const auth = require("../middleware/auth.middleware");

router.get("/", auth, controller.getRewardTypes);

module.exports = router;