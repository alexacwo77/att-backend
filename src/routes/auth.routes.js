const router = require("express").Router();

const authController = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.me);

module.exports = router;