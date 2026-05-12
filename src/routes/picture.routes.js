const router = require("express").Router();

const controller = require("../controllers/picture.controller");

const auth = require("../middleware/auth.middleware");

router.get("/", auth, controller.getPictures);

module.exports = router;