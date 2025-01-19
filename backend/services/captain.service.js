const Captain = require('../models/captain.model');

const captainService = {
    createCaptain: async ({ firstname, lastname, email, password, vehicle }) => {
        // Validate required fields
        if (!firstname || !lastname || !email || !password || 
            !vehicle.color || !vehicle.plate || !vehicle.capacity || !vehicle.vehicleType) {
            throw new Error('All fields are required');
        }

        try {
            // Create new captain instance
            const captain = await Captain.create({
                firstname,
                lastname,
                email,
                password,
                vehicle: {
                    color: vehicle.color,
                    plate: vehicle.plate,
                    capacity: vehicle.capacity,
                    vehicleType: vehicle.vehicleType
                }
            });
            
            return captain;
        } catch (error) {
            // Add more context to the error
            if (error.code === 11000) { // MongoDB duplicate key error
                throw new Error('Email already exists');
            }
            throw error;
        }
    }
};

module.exports = captainService;



    
    