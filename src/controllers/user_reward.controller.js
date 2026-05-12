const userRewardService = require("../services/user_reward.service");
const { success, error } = require("../utils/response");

exports.getRedeemedRewards = async (req, res) => {
    try {
        const isAdmin = req.user.role === "admin";
        const currentUserId = req.user.userId;

        const requestedUserId = req.query.user_id
            ? parseInt(req.query.user_id, 10)
            : null;

        let userId;

        if (isAdmin) {
            userId = requestedUserId;
        } else {
            if (requestedUserId && requestedUserId !== currentUserId) {
                return error(res, "Forbidden", 403);
            }

            userId = currentUserId;
        }

        const rewards = await userRewardService.getRedeemedRewards(userId);

        return success(res, {
            rewards,
        });

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};

exports.updateUserReward = async (req, res) => {
    try {
        const isAdmin = req.user.role === "admin";

        if (!isAdmin) {
            return error(res, "Forbidden", 403);
        }

        const { id } = req.params;
        const { is_used } = req.body;

        const updated = await userRewardService.updateUserReward(id, {
            isUsed: Boolean(is_used),
        });

        return success(res, {
            user_reward: updated,
        });

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};