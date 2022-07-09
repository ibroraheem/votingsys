const Candidate = require('../models/candidates')


const addCandidate = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({ message: 'Unauthorized' })
    }
    const { name, nickname, post, image, department } = req.body
    const candidate = new Candidate({
        nickname,
        name,
        post,
        image,
        department
    })
    try {
        await candidate.save()
        res.status(201).send({ message: 'Candidate created successfully' })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }

}
const deleteCandidate = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({ message: 'Unauthorized' })
    }
    const { id: _id } = req.params
    try {
        await Candidate.deleteOne({ _id: Candidate._id })
        res.status(200).send({ message: 'Candidate deleted successfully' })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}
const updateCandidate = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({ message: 'Unauthorized' })
    }
    const { nickname, name, post, image, department } = req.body
    try {
        await Candidate.updateOne({ _id: Candidate._id }, { name, nickname, post, image, department })
        res.status(200).send({ Candidate: Candidate, message: 'Candidate updated successfully' })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}
const getCandidates = async (req, res) => {
    try {
        const candidate = await Candidate.find({})
        res.status(200).send(candidate)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}
const getCandidateVotes = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({ message: 'Unauthorized' })
    }
    try {
        0
        const candidate = await Candidate.find({})
        res.status(200).json({ candidate: candidate })
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}
const getCandidateVoters = async (req, res) => {
    const { id: _id } = req.params
    try {
        const candidate = await Candidate.findOne({ _id: Candidate._id })
        res.status(200).send(candidate.votedBy)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}
const getCandidate = async (req, res) => {
    const { id: _id } = req.params
    try {
        const candidate = await Candidate.findOne({ _id: Candidate._id })
        res.status(200).send(candidate)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

module.exports = { addCandidate, deleteCandidate, updateCandidate, getCandidates, getCandidate, getCandidateVotes, getCandidateVoters }