const userModel = require('../models/user.model');
const { validationResult } = require('express-validator');
const userService = require('../services/user.service');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstname, lastname, email, password } = req.body;

        const isUserAlready = await userModel.findOne({email});
        if(isUserAlready) {
            return res.status(400).json({message: 'User already exists'});
        }

    const hashPassword = await userModel.hashPassword(password);

        const user = await userService.createUser({
            firstname,
            lastname,
            email,
            password: hashPassword
        });

        const token = user.generateAuthToken();

        res.status(201).json({ token, user });
    } catch (error) {
        next(error);
    }
}

module.exports.loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();

        res.cookie('token', token);
        
        user.password = undefined;
        
        res.status(200).json({ token, user });
    } catch (error) {
        next(error);
    }
}

module.exports.getUserProfile = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        res.status(200).json({ 
            success: true,
            user: req.user 
        });
    } catch (error) {
        next(error);
    }
}
module.exports.logoutUser = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        let token;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        
        // If no token in header, try cookies
        if (!token && req.cookies) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(400).json({ 
                success: false,
                message: 'No token provided' 
            });
        }

        // Log for debugging
        console.log('Token to blacklist:', token);

        // Add to blacklist
        await blacklistTokenModel.create({ token });

        // Clear cookie if it exists
        res.clearCookie('token');

        console.log('Token blacklisted successfully');

        res.status(200).json({ 
            success: true,
            message: 'Logged out successfully' 
        });
    } catch (error) {
        console.error('Logout error:', error);
        next(error);
    }
};
