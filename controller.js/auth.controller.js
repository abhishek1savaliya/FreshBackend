const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwtAuth');

exports.createUser = [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ success: false, error: "A user with this email already exists" });
            }

            const hashedPassword = await hashPassword(req.body.password)

            // Create a new user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            });

            const data = {
                user: {
                    id: user.id,
                }
            };
            const authToken = generateToken(data)

            res.json({ success: true, authToken });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, error: "Internal Server Error" });
        }
    }
];

exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid credentials" });
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Invalid credentials" });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        const authToken = generateToken(payload)

        res.json({ success: true, authToken });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

exports.getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json({ success: true, user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

