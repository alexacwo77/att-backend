const pictureService = require("../services/picture.service");
const { success, error } = require("../utils/response");

exports.getPictures = async (req, res) => {
    try {
        const { type } = req.query;

        const pictures = await pictureService.getPictures(type);

        return success(res, {
            pictures,
        });

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};
