const rideModel = require('../models/ride.model');
const mapsService = require('../services/maps.service');
const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');

function generateOtp(num) {
    const otp = Math.floor(10 ** (num - 1) + Math.random() * 9 * 10 ** (num - 1));
    if (isNaN(otp)) {
        throw new Error('Failed to generate OTP');
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedOtp = bcrypt.hashSync(otp.toString(), salt);
    return { otp: otp.toString(), hashedOtp };
}

const generateOTP = (num) => generateOtp(num);

async function getFare(pickup, destination) {
    
    if (!pickup || !destination) {
        throw new Error('Invalid pickup or destination coordinates');
    }

    const distanceTimeResponse = await mapsService.getDistanceAndTime(pickup, destination);
    
    if (!distanceTimeResponse.success) {
        throw new Error('Failed to calculate distance and time');
    }

    // Convert meters to kilometers and seconds to minutes
    const distance = distanceTimeResponse.data.distanceValue / 1000; 
    const duration = distanceTimeResponse.data.durationValue / 60; 

    const BASE_FARE = {
        car: 50,
        auto: 30,
        bike: 20
    };

    const RATE_PER_KM = {
        car: 15,
        auto: 12,
        bike: 8
    };

    const TIME_MULTIPLIER = {
        car: 2,
        auto: 1.5,
        bike: 1
    };

    const fares = {
        car: Math.round(BASE_FARE.car + (distance * RATE_PER_KM.car) + (duration * TIME_MULTIPLIER.car)),
        auto: Math.round(BASE_FARE.auto + (distance * RATE_PER_KM.auto) + (duration * TIME_MULTIPLIER.auto)),
        bike: Math.round(BASE_FARE.bike + (distance * RATE_PER_KM.bike) + (duration * TIME_MULTIPLIER.bike))
    };

    return fares;
}
module.exports.getFare = getFare;

module.exports.createRide = async ({ 
    user, 
    pickup, 
    destination,
    vehicleType 
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('Missing required fields');
    }

    const fares = await getFare(pickup, destination);
    const { otp, hashedOtp } = generateOtp(6);
    
    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        vehicleType,
        fare: fares[vehicleType],
        otp: hashedOtp 
    });

   
    const rideResponse = ride.toObject();
    delete rideResponse.otp; 
    rideResponse.rideOTP = otp; // Add plain OTP for user

    return rideResponse;
}
