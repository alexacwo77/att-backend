exports.success = (res, data = {}, status = 200) => {
    return res.status(status).json({
        message: "success",
        data,
    });
};

exports.error = (res, message, status = 500) => {
    return res.status(status).json({
        message,
    });
};