const prisma = require("../config/db");

exports.findUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email },
        include: {
            role: true,
        },
    });
};

exports.findUserById = async (id) => {
    return prisma.user.findUnique({
        where: { id },
        include: {
            role: true,
        },
    });
};