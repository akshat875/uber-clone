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

            try {
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

                // Check if token is blacklisted
                const isBlacklisted = await BlacklistToken.findOne({ token });
                if (isBlacklisted) {
                    return res.status(401).json({ 
                        success: false,
                        message: 'Token has been invalidated. Please login again.' 
                    });
                }

                // Attach user to request
                req.user = user;
                next();
            } catch (error) {
                console.error('Token verification error:', error);
                return res.status(401).json({ 
                    success: false,
                    message: 'Invalid token.' 
                });
            }
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(500).json({ 
                success: false,
                message: 'Internal server error.' 
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

            try {
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

                // Check if token is blacklisted
                const isBlacklisted = await BlacklistToken.findOne({ token });
                if (isBlacklisted) {
                    return res.status(401).json({ 
                        success: false,
                        message: 'Token has been invalidated. Please login again.' 
                    });
                }

                // Attach captain to request
                req.captain = captain;
                next();
            } catch (error) {
                console.error('Token verification error:', error);
                return res.status(401).json({ 
                    success: false,
                    message: 'Invalid token.' 
                });
            }
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(500).json({ 
                success: false,
                message: 'Internal server error.' 
            });
        }
    }
};

module.exports = authMiddleware;
