const Candidate = require('../models/candidate');


const addCandidate = async (req, res) => {
    const candidate = await Candidate.create(req.body)
    res.status(201).json({candidate})
}
const getCandidates = async (req, res) => {
    const candidates = await Candidate.find({})
    res.status(200).json({candidates})
}
const getCandidate = async (req, res) => {
    const candidate = await Candidate.findById(req.params.id)
    res.status(200).json({candidate})
}
const updateCandidate = async (req, res) => {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json({candidate})
}
const deleteCandidate = async (req, res) => {
    const candidate = await Candidate.findByIdAndDelete(req.params.id)
    res.status(200).json({candidate})
}
module.exports = {addCandidate, getCandidates, getCandidate, updateCandidate, deleteCandidate}
