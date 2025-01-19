const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const BlacklistToken = require('../models/blacklistToken.model');
const Captain = require('../models/captain.model');

const authMiddleware = {
    authUser: async (req, res, next) => {
        try {
            let token;
            
            // Extract token from Authorization header
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
            
            // If no token in header, try cookies
            if (!token && req.cookies) {
                token = req.cookies.token;
            }

            if (!token) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Access denied. No token provided.' 
                });
            }

            // Check if token is blacklisted
            const isBlacklisted = await BlacklistToken.findOne({ token });
            if (isBlacklisted) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Token has been invalidated. Please login again.' 
                });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Fetch user data
            const user = await userModel.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(401).json({ 
                    success: false,
                    message: 'User not found.' 
                });
            }

            // Attach user to request
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token.' 
            });
        }
    },

    authCaptain: async (req, res, next) => {
        try {
            let token;
            
            // Extract token from Authorization header
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
            
            // If no token in header, try cookies
            if (!token && req.cookies) {
                token = req.cookies.token;
            }

            if (!token) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Access denied. No token provided.' 
                });
            }

            // Check if token is blacklisted
            const isBlacklisted = await BlacklistToken.findOne({ token });
            if (isBlacklisted) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Token has been invalidated. Please login again.' 
                });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Fetch captain data
            const captain = await Captain.findById(decoded.id).select('-password');
            
            if (!captain) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Captain not found.' 
                });
            }

            // Attach captain to request
            req.captain = captain;
            next();
        } catch (error) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token.' 
            });
        }
    }
};

module.exports = authMiddleware;
