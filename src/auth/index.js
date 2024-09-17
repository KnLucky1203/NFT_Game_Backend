const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken");
const { User } = require('../user/user.model')
const validator = require('./auth.validator')


router.post('/auth/login', login)
router.post('/auth/register', register)

async function login(req, res, next){
    try {
        console.log("login ----", req.body);
        await validator.login(req);

        const { username, password } = req.body;

        const user = await User.findOne({name: username});
        
        if (!user) {
            return res.json({ code: '03', data: [], message: "User not exist"})
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.json({ code: '03', data: [], message: "Invalid password"})
        }

        const token = jwt.sign({ id: user._id, username: user.name }, process.env.JWT_SECRET, {
            noTimestamp: true,
            expiresIn: '1h',
        })

        res.json({code:'00', token, message: ''})

    } catch(err) {
        res.json(err.message);
    }
}

async function register(req, res) {
    try {
        await validator.register(req);
        // Check if the user already exists
        const { username, password, email } = req.body;
        let user = await User.findOne({ name: username });
        if (user) {
            return res.json({ code: '03', message: 'User already exists' });
        }

        // Create new user instance
        user = new User({
            // email,
            name: username,
            password,  // Password will be hashed in the model pre-save hook
        });
        console.log("user ======", user)
        // Save the user to the database
        await user.save();

        const token = jwt.sign({ id: user._id, username: user.name }, process.env.JWT_SECRET, {
            noTimestamp: true,
            expiresIn: '1h',
        })
        res.json({ code:'00', token: token, message: 'User registered successfully' })
    }catch(err) {
        console.log("error:", err.message)
        res.json(err.message);
    }
}

module.exports = router;