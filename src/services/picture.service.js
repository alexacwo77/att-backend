const prisma = require("../config/db");

exports.getPictures = async (type) => {
    const where = {};

    if (type) {
        where.type = type;
    }

    return prisma.picture.findMany({
        where,
        orderBy: {
            id: 'asc',
        },
    });
};