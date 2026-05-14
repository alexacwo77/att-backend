const prisma = require("../config/db");
const bcrypt = require("bcrypt");

exports.getEmployees = async (search) => {
    return prisma.user.findMany({
        where: {
            role: {
                name: "employee",
            },
            OR: [
                {
                    name: {
                        contains: search || "",
                    },
                },
                {
                    email: {
                        contains: search || "",
                    },
                },
            ],
        },
        include: {
            role: true,
            picture: true,
        },
        orderBy: {
            id: "desc",
        }
    });
};

exports.getEmployeeById = async (id) => {
    return prisma.user.findFirst({
        where: {
            id: Number(id),
            role: {
                name: "employee",
            },
        },
        include: {
            role: true,
        },
    });
};

exports.createEmployee = async (data) => {

    // For development purposes, salt 8 is ok
    const password = await bcrypt.hash(
        data.password,
        8
    );

    const employeeRole = await prisma.role.findFirst({
        where: {
            name: "employee"
        }
    });

    if (!employeeRole) {
        throw new Error("Employee role not found");
    }

    return prisma.user.create({
        data: {
            name: data.name,
            nickname: data.nickname,
            email: data.email,
            password: password,
            cardId: data.card_id,
            role: {
                connect: {
                    id: employeeRole.id
                }
            }
        },
    });
};

exports.updateEmployee = async (id, data) => {
    const updateData = {};

    ['name', 'nickname', 'email', 'cardId'].forEach(field => {
        if (data[field] !== undefined) {
            updateData[field] = data[field];
        }
    });

    if (data.picture_id !== undefined) {
        updateData.picture = data.picture_id
            ? {
                connect: {
                    id: Number(data.picture_id),
                },
            }
            : {
                disconnect: true,
            };
    }

    return prisma.user.update({
        where: {
            id: Number(id),
        },

        data: updateData,

        include: {
            picture: true,
        },
    });
};

exports.deleteEmployee = async (id) => {
    return prisma.user.delete({
        where: {
            id: Number(id),
        },
    });
};