const router = require("express").Router();

const controller = require("../controllers/reward.controller");

const auth = require("../middleware/auth.middleware");
const superadmin = require("../middleware/superadmin.middleware");

router.get("/", auth, controller.getRewards);

router.get("/:id", auth, controller.getRewardById);

router.post(
    "/",
    auth,
    superadmin,
    controller.createReward
);

router.put(
    "/:id",
    auth,
    superadmin,
    controller.updateReward
);

router.delete(
    "/:id",
    auth,
    superadmin,
    controller.deleteReward
);

router.post(
    "/:id/redeem",
    auth,
    controller.redeemReward
);

module.exports = router;