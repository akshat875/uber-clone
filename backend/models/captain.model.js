const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    firstname: { 
        type: String, 
        required: true,
        minlength: [3, 'First name must be at least 3 characters long']
    },
    lastname: { 
        type: String, 
        required: true,
        minlength: [3, 'Last name must be at least 3 characters long']
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true,
        select: false
    },
    socketId: { type: String },
    status: { 
        type: String,
        enum: ['active','inactive'], 
        default: 'inactive' 
    },
    vehicle: {
        color: { 
            type: String, 
            required: true, 
            minlength: [3, 'Color must be at least 3 characters long'],
        },
        plate: { 
            type: String, 
            required: true,
            minlength: [3, 'Plate must be at least 3 characters long'],
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1'],
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car','motorcycle', 'auto'],
        }
    }
});

// Add generateToken method to the schema
captainSchema.methods.generateToken = function () {
    const token = jwt.sign(
        { id: this._id }, 
        process.env.JWT_SECRET,
        { expiresIn: '24h' }  // Token expires in 24 hours
    );
    return token;
}

const Captain = mongoose.model('Captain', captainSchema);

module.exports = Captain;