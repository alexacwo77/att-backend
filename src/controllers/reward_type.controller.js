const rewardTypeService = require("../services/reward_type.service");
const { success, error } = require("../utils/response");

exports.getRewardTypes = async (req, res) => {
    try {

        const reward_types = await rewardTypeService.getRewardTypes();

        return success(res, {
            reward_types,
        });

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};
