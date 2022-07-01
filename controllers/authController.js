const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Candidate = require('../models/candidate')
require('dotenv').config()
const register = async (req, res) => {

    const { surname, firstname, matric, department, password } = req.body
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';
    const user = new User({
        surname,
        firstname,
        matric,
        department,
        role,
        password
    })
    try {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        await user.save()
        res.status(201).send({ message: 'User created successfully' })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }

}

const login = async (req, res) => {
    const { matric, password } = req.body
    try {
        const user = await User.findOne({ matric })
        if (!user) {
            return res.status(400).send({ message: 'Invalid credentials' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid credentials' })
        }
        const token = jwt.sign({ matric: user.matric, department: user.department }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).send({ token })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}
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
    const { nickname } = req.body
    try {
        await Candidate.deleteOne({ nickname })
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
        await Candidate.updateOne({ nickname }, { name, post, image, department })
        res.status(200).send({ message: 'Candidate updated successfully' })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}
const getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({})
        res.status(200).send(candidates)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

module.exports = { register, login, addCandidate, deleteCandidate, updateCandidate, getCandidates }