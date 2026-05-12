const prisma = require("../config/db");

exports.getRewards = async (rewardTypeId, availableOnly) => {

    const where = {};

    if (rewardTypeId) {
        where.reward_type_id = Number(rewardTypeId);
    }

    if (availableOnly === "true") {
        where.stock = {
            gt: 0,
        };
    }

    return prisma.reward.findMany({
        where,
        include: {
            rewardType: true,
            picture: true
        },
        orderBy: {
            cost: 'asc'
        },
    });
};

exports.getRewardById = async (id) => {
    return prisma.reward.findUnique({
        where: {
            id: Number(id),
        },
    });
};

exports.createReward = async (data) => {
    return prisma.reward.create({
        data: {
            name: data.name,
            description: data.description,
            rewardTypeId: Number(data.reward_type_id),
            cost: data.cost,
            stock: data.stock,
            maxAmount: data.max_amount,
            pictureId: data.picture_id ? Number(data.picture_id) : null,
        },
    });
};

exports.updateReward = async (id, data) => {
    return prisma.reward.update({
        where: {
            id: Number(id),
        },
        data: {
            name: data.name,
            description: data.description,
            rewardTypeId: Number(data.reward_type_id),
            cost: Number(data.cost),
            stock: Number(data.stock),
            maxAmount: Number(data.max_amount),
        },
        include: {
            picture: true,
        },
    });
};

exports.deleteReward = async (id) => {
    return prisma.reward.delete({
        where: {
            id: Number(id),
        },
    });
};

exports.redeemReward = async (userId, rewardId, amount) => {
    const reward = await prisma.reward.findUnique({
        where: { id: rewardId }
    });

    if (!reward) {
        throw new Error("Reward not found");
    }

    if (amount <= 0) {
        throw new Error("Invalid amount");
    }

    if (reward.stock < amount) {
        throw new Error("Not enough stock available");
    }

    if (amount > reward.maxAmount) {
        throw new Error("Exceeds max allowed per redemption");
    }

    const totalCost = reward.cost * amount;

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.points < totalCost) {
        throw new Error("Not enough points");
    }

    const updatedReward = await prisma.$transaction(async (tx) => {

        await tx.user.update({
            where: { id: userId },
            data: {
                points: {
                    decrement: totalCost
                }
            }
        });

        const updated = await tx.reward.update({
            where: { id: rewardId },
            data: {
                stock: { decrement: amount },
                redeemedAmount: { increment: amount }
            }
        });

        await tx.userReward.create({
            data: {
                userId,
                rewardId,
                amount,
                redeemedAt: new Date()
            }
        });

        return updated;
    });

    return {
        success: true,
        updated_amount: updatedReward.stock
    };
};