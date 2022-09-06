const mongoose = require('mongoose')
const CandidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    matric: {
        type: String,
        required: true,
        unique: true
    },
    post: {
        type: String,
        required: true,
        enum: ['President', 'Vice President', 'General Secretary', 'Financial Secretary', 'Sports Secretary', 'Welfare Secretary', 'PRO', 'Assistant General Secretary', 'Social Secretary', 'Technical Director', 'SRC']
    },
    image: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true,
        enum: ['100', '200', '300', '400']
    }
}, { timestamps: true }
)

const Candidates = new mongoose.model('Candidates', CandidateSchema)

module.exports = Candidates