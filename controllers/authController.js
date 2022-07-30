const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
require('dotenv').config()


const register = async (req, res) => {

    const { surname, firstname, matric, department, password } = req.body
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'voter';
    const email = matric.replace('/', '-') + '@students.unilorin.edu.ng'

    const user = new User({
        surname,
        firstname,
        matric,
        department,
        role,
        password,
        confirmationCode: token
    })
    var token = jwt.sign({ matric: user.matric, department: user.department, level: user.level, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' })
    try {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        const transport = nodemailer.createTransport({
            host: 'smtp.zoho.eu',
            port: 465,
            auth: {
                user: process.env.MAIL,
                pass: process.env.PASS
            }

        })
        const mailOptions = {
            from: 'ibroraheem@zohomail.eu',
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
    User.findOne({ confirmationCode: req.params.token })
        .then(user => {
            if (user) {
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
            return res.status(400).send({ message: 'Invalid Matric Number' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid Password' })
        }
        const token = jwt.sign({ matric: user.matric, department: user.department, level: user.level, role: user.role, verified: user.verified}, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).send({ token })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

module.exports = { register, login, verifyVoter }