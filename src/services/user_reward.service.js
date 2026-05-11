const prisma = require("../config/db");

exports.getRedeemedRewards = async (userId) => {

    const rewards = await prisma.userReward.findMany({
        where: {
            userId,
        },
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

        const key = `${item.rewardId}-${day}`;

        if (!grouped.has(key)) {

            grouped.set(key, {
                id: key,
                rewardId: item.rewardId,
                amount: item.amount,
                redeemedAt: item.redeemedAt,

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