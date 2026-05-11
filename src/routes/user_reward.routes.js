const router = require("express").Router();

const controller = require("../controllers/user_reward.controller");

const auth = require("../middleware/auth.middleware");

router.get("/", auth, controller.getRedeemedRewards);

module.exports = router;