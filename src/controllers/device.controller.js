const deviceService = require("../services/device.service");
const { success, error } = require("../utils/response");

exports.checkIn = async (req, res) => {
    try {
        const result = await deviceService.checkIn(req.body);

        if (!result) {
            return error(res, "No valid event found for check-in", 400);
        }

        return success(res, result);

    } catch (err) {

        if (err.message === "DEVICE_NOT_FOUND") {
            return error(res, "Device not found", 404);
        }

        return error(res, "Server error: " + err.message);
    }
};