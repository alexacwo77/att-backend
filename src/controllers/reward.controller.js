const rewardService = require("../services/reward.service");
const { success, error } = require("../utils/response");

exports.getRewards = async (req, res) => {
    try {

        const rewards = await rewardService.getRewards(
            req.query.rewardTypeId,
            req.query.available_only
        );

        return success(res, {
            rewards,
        });

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};

exports.getRewardById = async (req, res) => {
    try {

        const reward = await rewardService.getRewardById(
            req.params.id
        );

        if (!reward) {
            return error(res, "Reward not found", 404);
        }

        return success(res, reward);

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};

exports.createReward = async (req, res) => {
    try {

        const reward = await rewardService.createReward(req.body);

        return success(res, {
            reward_id: reward.id
        }, 201);

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};

exports.updateReward = async (req, res) => {
    try {

        await rewardService.updateReward(
            req.params.id,
            req.body
        );

        return success(res, {});

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};

exports.deleteReward = async (req, res) => {
    try {

        await rewardService.deleteReward(
            req.params.id
        );

        return success(res, {});

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};

exports.redeemReward = async (req, res) => {
    try {
        // We get user from auth middleware
        const userId = req.user.userId;
        const rewardId = Number(req.params.id);
        const amount = Number(req.body.amount || 1);

        const result = await rewardService.redeemReward(
            userId,
            rewardId,
            amount
        );

        return success(res, result);

    } catch (err) {
        return error(res, err.message, 400);
    }
};