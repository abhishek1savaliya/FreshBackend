const jwt = require('jsonwebtoken');

const JWT_SECRET = "helloThisisAbhishek";

exports.generateToken = (data) => {
    return jwt.sign(data, JWT_SECRET);
};

exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};
