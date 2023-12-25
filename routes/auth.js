const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const user = require('../controller.js/auth.controller');

const JWT_SECRET = "Abhishekhasenoughpowertolearnmore";

router.post('/createuser', user.createUser);


router.post('/login', user.login);


router.post('/getuser', fetchuser, user.getUser);

module.exports = router;
