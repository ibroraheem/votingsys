const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    matric: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
        enum: ['ABE', 'BME', 'CHE', 'CPE', 'CVE', 'ELE', 'FBE', 'MEE', 'MME', 'WRE']
    },

    level: {
        type: String,
        required: true,
        enum: ['100', '200', '300', '400', '500']
    },

    status: {
        type: String,
        required: true,
        enum: ['verified', 'unverified'],
        default: 'unverified'
    },
    confirmationCode: {
        type: String,
        unique: true
    },
    blacklisted: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        required: false
    },
    otpVerified: {
        type: Boolean,
        default: false
    },
    voted: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
)



const User = mongoose.model('User', UserSchema)
module.exports = User