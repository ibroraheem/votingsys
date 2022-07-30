const Candidate = require('../models/candidate');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;


const addCandidate = async (req, res) => {
    var token = req.header.authorization.split(' ')[1]
    var decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        const candidate = await Candidate.create(req.body)
        res.status(200).json({ candidate })
    }
}
const getCandidates = async (req, res) => {
    const candidates = await Candidate.find({})
    res.status(200).json({ candidates })
}
const getCandidate = async (req, res) => {
    const candidate = await Candidate.findById(req.params.id)
    res.status(200).json({ candidate })
}
const updateCandidate = async (req, res) => {
    if (decoded.role === 'admin') {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json({ candidate })
    }
}
const deleteCandidate = async (req, res) => {
    if (decoded.role === 'admin') {
        const candidate = await Candidate.findByIdAndDelete(req.params.id)
        res.status(200).json({ candidate })
    }
}
module.exports = { addCandidate, getCandidates, getCandidate, updateCandidate, deleteCandidate }
