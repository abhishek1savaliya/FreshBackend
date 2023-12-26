const { verifyToken } = require("../utils/jwtAuth");

const AUTH_ERROR_MESSAGE = "Please authenticate using a valid token.";

const sendErrorResponse = (res, message) => {
    res.status(401).send({ error: message });
};

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return sendErrorResponse(res, AUTH_ERROR_MESSAGE);
    }

    try {
        const data = verifyToken(token);
        req.user = data.user;
        next();
    } catch (err) {
        return sendErrorResponse(res, AUTH_ERROR_MESSAGE);
    }
};

module.exports = fetchuser;
