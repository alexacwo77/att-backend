const router = require("express").Router();

const controller = require("../controllers/employee.controller");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

router.get("/", auth, controller.getEmployees);

router.get("/:id", auth, controller.getEmployeeById);

router.post(
    "/",
    auth,
    admin,
    controller.createEmployee
);

router.put(
    "/:id",
    auth,
    controller.updateEmployee
);

router.delete(
    "/:id",
    auth,
    admin,
    controller.deleteEmployee
);

module.exports = router;