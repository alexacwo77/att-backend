const router = require("express").Router();

const controller = require("../controllers/user_reward.controller");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

router.get("/", auth, controller.getRedeemedRewards);
router.put(
    "/:id",
    auth,
    admin,
    controller.updateUserReward
);

module.exports = router;