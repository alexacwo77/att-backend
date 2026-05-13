const router = require("express").Router();

const controller = require("../controllers/employee.controller");

const auth = require("../middleware/auth.middleware");
const superadmin = require("../middleware/superadmin.middleware");

router.get("/", auth, controller.getEmployees);

router.get("/:id", auth, controller.getEmployeeById);

router.post(
    "/",
    auth,
    superadmin,
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
    superadmin,
    controller.deleteEmployee
);

module.exports = router;