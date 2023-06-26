const mongoose = require('mongoose')

const VotesSchema = new mongoose.Schema({
    voter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    ballot: {
        type: Object,
        required: true
    },

}, { timestamps: true })

const Votes = new mongoose.model('Votes', VotesSchema)
module.exports = Votes