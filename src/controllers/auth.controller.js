const prisma = require("../config/db");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const { success, error } = require("../utils/response");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                role: true,
            },
        });

        if (!user) {
            return error(res, "Invalid credentials", 401);
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return error(res, "Invalid credentials", 401);
        }

        const token = generateToken({
            userId: user.id,
            role: user.role.name,
        });

        return success(res, {
            token,
            user: {
                id: user.id,
                name: user.name,
                nickname: user.nickname,
                email: user.email,
                points: user.points,
                picture_id: user.picture_id,
            },
            role: user.role.name,
        });

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};


exports.me = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                role: true,
            },
        });

        if (!user) {
            return error(res, "User not found", 404);
        }

        return success(res, {
            id: user.id,
            name: user.name,
            nickname: user.nickname,
            email: user.email,
            role_name: user.role.name,
            points: user.points,
            picture_id: user.pictureId
        });

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};
