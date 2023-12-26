const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwtAuth');

const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    return true;
};

exports.createUser = [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 }),
    async (req, res) => {
        if (!handleValidationErrors(req, res)) return;

        if (await User.findOne({ email: req.body.email })) {
            return res.status(400).json({ success: false, error: "A user with this email already exists" });
        }

        const hashedPassword = await hashPassword(req.body.password);
        const user = await User.create({ ...req.body, password: hashedPassword });

        const authToken = generateToken({ user: { id: user.id } });
        res.json({ success: true, authToken });
    }
];

exports.login = async (req, res) => {
    if (!handleValidationErrors(req, res)) return;

    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await comparePassword(req.body.password, user.password))) {
        return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const authToken = generateToken({ user: { id: user.id } });
    res.json({ success: true, authToken });
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json({ success: true, user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};