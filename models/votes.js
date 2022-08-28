const mongoose = require('mongoose')

const VotesSchema = new mongoose.Schema({

    candidate: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidates' }],
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' }],
    voter: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
}, { timestamps: true })

const Votes = new mongoose.model('Votes', VotesSchema)
module.exports = Votes