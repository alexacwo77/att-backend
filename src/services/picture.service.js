const prisma = require("../config/db");

exports.getPictures = async (type) => {
    console.log(prisma.PictureType)
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