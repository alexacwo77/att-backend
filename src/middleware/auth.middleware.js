const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const token = header.split(" ")[1];

        req.user = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
};