const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');

module.exports.createRide = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { pickup, destination, vehicleType } = req.body;
        const user_id = req.user._id;

        const ride = await rideService.createRide({ user: user_id, pickup, destination, vehicleType });

        // Include all ride details and OTP in response
        res.status(201).json({
            success: true,
            data: {
                _id: ride._id,
                user: ride.user,
                pickup: ride.pickup,
                destination: ride.destination,
                fare: ride.fare,
                status: ride.status,
                vehicleType: ride.vehicleType,
                __v: ride.__v,
                otp: ride.rideOTP
            }
        });
    } catch (error) {
        console.error('Error creating ride:', { error, body: req.body });
        res.status(500).json({
            success: false,
            message: error.message || 'An error occurred while creating ride',
        });
    }
}

module.exports.getFare = async (req, res) => {
    try {
        const { pickup, destination } = req.query;
        console.log('Getting fare for:', { pickup, destination });

        if (!pickup || !destination) {
            return res.status(400).json({
                success: false,
                message: 'Pickup and destination locations are required'
            });
        }

        const fares = await rideService.getFare(pickup, destination);
        console.log('Calculated fares:', fares);

        return res.json({
            success: true,
            data: fares
        });
    } catch (error) {
        console.error('Error in getFare controller:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to calculate fare'
        });
    }
};