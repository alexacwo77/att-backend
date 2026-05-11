const router = require("express").Router();

const controller = require("../controllers/location.controller");

const auth = require("../middleware/auth.middleware");

router.get("/", auth, controller.getLocations);

module.exports = router;