const userRewardService = require("../services/user_reward.service");
const { success, error } = require("../utils/response");

exports.getRedeemedRewards = async (req, res) => {
    try {
        const userId = req.user.userId;

        const rewards = await userRewardService.getRedeemedRewards(userId);

        return success(res, {
            rewards,
        });

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};