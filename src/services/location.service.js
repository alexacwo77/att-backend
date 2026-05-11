const prisma = require("../config/db");

exports.getLocations = async () => {

    const where = {};

    return prisma.location.findMany({
        where,
    });
};
