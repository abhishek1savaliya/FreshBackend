const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Abhishekhasenoughpowertolearnmore";

// ROUTE-1: Create a user using POST "/api/auth/createuser". Doesn't require authorization.

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success: false, error: "A user with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

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
        const authToken = jwt.sign(data, JWT_SECRET);

        res.json({ success: true, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// ROUTE-2: Authenticate a User

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
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

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success: false, error: "Invalid credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ success: true, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// ROUTE-3: Get Logged-in User Details using POST "/api/auth/getuser". Login Required

router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json({ success: true, user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = router;
