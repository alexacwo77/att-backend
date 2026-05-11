const router = require("express").Router();

const controller = require("../controllers/event.controller");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

router.get("/", auth, controller.getEvents);

router.get("/:id", auth, controller.getEventById);

router.post(
    "/",
    auth,
    admin,
    controller.createEvent
);

router.put(
    "/:id",
    auth,
    admin,
    controller.updateEvent
);

router.delete(
    "/:id",
    auth,
    admin,
    controller.deleteEvent
);

module.exports = router;