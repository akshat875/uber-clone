const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Captain = require('../models/captain.model');
const BlacklistToken = require('../models/blacklistToken.model');

module.exports.registerCaptain = async (req, res, next) => {
    try {
        // Validate request data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstname, lastname, email, password, vehicle } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create captain using service
        const captain = await captainService.createCaptain({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            vehicle
        });

        // Generate authentication token
        const token = captain.generateToken();

        // Send response
        res.status(201).json({ 
            success: true,
            token,
            captain: {
                _id: captain._id,
                firstname: captain.firstname,
                lastname: captain.lastname,
                email: captain.email,
                vehicle: captain.vehicle
            }
        });

    } catch (error) {
        if (error.message === 'All fields are required') {
            return res.status(400).json({ 
                success: false,
                message: error.message 
            });
        }
        if (error.message === 'Email already exists') {
            return res.status(400).json({ 
                success: false,
                message: error.message 
            });
        }
        next(error);
    }
}

module.exports.loginCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        const { email, password } = req.body;

        // Find captain with password
        const captain = await Captain.findOne({ email }).select('+password');

        if (!captain) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, captain.password);

        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Generate token
        const token = captain.generateToken();

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Send response
        res.status(200).json({
            success: true,
            token,
            captain: {
                _id: captain._id,
                firstname: captain.firstname,
                lastname: captain.lastname,
                email: captain.email,
                vehicle: captain.vehicle,
                status: captain.status
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({captain: req.captain});
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    await BlacklistToken.create({token});
    res.clearCookie('token');
    res.status(200).json({message: 'Logged out successfully'});

}
