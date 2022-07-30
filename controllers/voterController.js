const User = require('../models/user')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET


const getVoters = async (req, res) => {
    const voters = await User.find({})
    res.status(200).json({ voters })
}

const deleteVoters = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        const voter = await User.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Voter deleted successfully', voter })
    }
}
module.exports = {deleteVoters, getVoters }