const locationService = require("../services/location.service");
const { success, error } = require("../utils/response");

exports.getLocations = async (req, res) => {
    try {

        const locations = await locationService.getLocations();

        return success(res, {
            locations,
        });

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};
