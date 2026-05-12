const router = require("express").Router();
const deviceController = require("../controllers/device.controller");

const deviceAuthMiddleware = require("../middleware/device.middleware");

router.post("/checkin", deviceAuthMiddleware, deviceController.checkIn);

module.exports = router;