const deviceService = require("../services/device.service");
const { success, error } = require("../utils/response");

const errorMap = {
    DEVICE_NOT_FOUND: {
        message: "Device not found",
        status: 404,
    },
    EVENT_NOT_FOUND: {
        message: "No valid event found for check-in",
        status: 404,
    },
    USER_NOT_FOUND: {
        message: "User with this RFID card not found",
        status: 404,
    },
    ATTENDANCE_RECORDED: {
        message: "Attendance has already been recorded",
        status: 409,
    },
};

exports.checkIn = async (req, res) => {
    try {
        const result = await deviceService.checkIn(req.body);

        return success(res, result);

    } catch (err) {

        const mappedError = errorMap[err.message];

        if (mappedError) {
            return error(
                res,
                mappedError.message,
                mappedError.status
            );
        }

        return error(res, "Server error: " + err.message);
    }
};