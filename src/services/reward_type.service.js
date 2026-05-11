const prisma = require("../config/db");

exports.getRewardTypes = async () => {

    const where = {};

    return prisma.rewardType.findMany({
        where,
    });
};
