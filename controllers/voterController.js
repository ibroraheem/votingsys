const User = require('../models/user')

const createVoter = async (req, res) => {
    const user = await User.create(req.body)
    res.status(201).json({user})
}

const getVoters = async (req, res) => {
    const voters = await User.find({})
    res.status(200).json({voters})
}

const deleteVoters = async (req, res) => {
    const voter = await User.findByIdAndDelete(req.params.id)
    res.status(200).json({message: 'Voter deleted successfully'})
}

module.exports = {createVoter, deleteVoters, getVoters}