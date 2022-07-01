const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Candidate = require('../models/candidates')
require('dotenv').config()
const register = async (req, res) => {

    const { surname, firstname, matric, department, password } = req.body
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'voter';
    const email = user.matric.replace('/', '-') + '@students.unilorin.edu.ng'
    var token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' })
    const user = new User({
        surname,
        firstname,
        matric,
        department,
        role,
        password,
        confirmationCode: token
    })
    try {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        const transport = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'thelma.mayer32@ethereal.email',
                pass: 'RQFCAESNyvY18ad5E1'
            }
        })
        const mailOptions = {
            from: 'noreply@nuesaunilorin.com',
            to: email,
            subject: 'Please confirm your account',
            html: `<h1>Please confirm your account</h1>
       <p>Please click the link to confirm your account: <a href="http://localhost/confirm/${token}">Confirm</a></p>
       <p>If you did not request this, please ignore this email</p>
       <p>Thank you</p>`
        }
        await user.save()
        res.status(201).send({ message: 'User created successfully' })
        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })

    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}
const verifyVoter = async (req, res) => {
    User.findOne({confirmationCode: req.params.token})
    .then(user => {
        if(user) {
            user.status = 'Verified'
            user.save()
            res.status(200).send({ message: 'User verified' })
        } else {
            res.status(400).send({ message: 'User not found' })
        }
    })
}

const login = async (req, res) => {
    if (User.status !== 'Verified') {
        return res.status(401).send({ message: 'Unverified Voter. Please check your email to verify your voter account' })
    }
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
        const candidates = await Candidate.find({})
        res.status(200).json(candidates)
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

module.exports = { register, login, verifyVoter, addCandidate, deleteCandidate, updateCandidate, getCandidates, getCandidate }