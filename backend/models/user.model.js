const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: [3, 'First name must be at least 3 characters long'],
    },
    lastname: {
        type: String,
        required: true,
        minlength: [3, 'last name must be at least 3 characters long'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, 'email must be at least 3 characters long'],
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: [6, 'password must be at least 6 characters long'],
    },
    socketId: {
        type: String,
        required: false,
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { id: this._id }, 
        process.env.JWT_SECRET,
        { expiresIn: '24h' }  // Token expires in 24 hours
    );
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;