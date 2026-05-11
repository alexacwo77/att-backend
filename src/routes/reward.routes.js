const router = require("express").Router();

const controller = require("../controllers/reward.controller");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

router.get("/", auth, controller.getRewards);

router.get("/:id", auth, controller.getRewardById);

router.post(
    "/",
    auth,
    admin,
    controller.createReward
);

router.put(
    "/:id",
    auth,
    admin,
    controller.updateReward
);

router.delete(
    "/:id",
    auth,
    admin,
    controller.deleteReward
);

router.post(
    "/:id/redeem",
    auth,
    controller.redeemReward
);

module.exports = router;