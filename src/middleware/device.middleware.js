module.exports = (req, res, next) => {
    const key = req.headers["x-device-key"];

    const validKeys = process.env.DEVICE_API_KEYS.split(",");

    if (!validKeys.includes(key)) {
        return res.status(401).json({ message: "Invalid device key" });
    }

    next();
};