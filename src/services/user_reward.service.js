const prisma = require("../config/db");

exports.getRedeemedRewards = async (userId) => {

    const rewards = await prisma.userReward.findMany({
        where: userId ? { userId } : {},
        include: {
            reward: {
                include: {
                    picture: true,
                    rewardType: true,
                }
            }
        },
        orderBy: {
            redeemedAt: "desc",
        }
    });

    const grouped = new Map();

    for (const item of rewards) {

        const day = new Date(item.redeemedAt)
            .toISOString()
            .split("T")[0];

        const key = `${item.userId}-${item.rewardId}-${day}-${item.isUsed}`;

        if (!grouped.has(key)) {

            grouped.set(key, {
                id: item.id,
                userId: item.userId,
                rewardId: item.rewardId,
                amount: item.amount,
                redeemedAt: item.redeemedAt,
                isUsed: item.isUsed,
                usedAt: item.usedAt,

                reward: {
                    ...item.reward,
                    picture_filename: item.reward.picture
                        ? item.reward.picture.fileName
                        : null,
                }
            });

        } else {

            const existing = grouped.get(key);

            existing.amount += item.amount;

            if (new Date(item.redeemedAt) > new Date(existing.redeemedAt)) {
                existing.redeemedAt = item.redeemedAt;
            }
        }
    }

    return Array.from(grouped.values());
};

exports.updateUserReward = async (id, data) => {
    return await prisma.userReward.update({
        where: {
            id: Number(id),
        },
        data: {
            isUsed: data.isUsed ?? null,
            usedAt: data.isUsed ? new Date() : null,
        },
    });
};