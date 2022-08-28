const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
require('dotenv').config()


const register = async (req, res) => {

    const { surname, firstname, othernames, matric, password } = req.body
    var email = matric.replace('/', '-') + '@students.unilorin.edu.ng'
    const token = jwt.sign({ id: user._id, matric: user.matric, voted: user.voted, department: user.department, level: user.level }, process.env.JWT_SECRET, { expiresIn: '1h' })

    const user = new User({
        surname,
        firstname,
        othernames,
        matric,
        department: (matric.includes('ga') ? 'ABE' : matric.includes('gb') ? 'CVE'
            : matric.includes('gc') ? 'ELE' : matric.includes('gd') ? 'MEE'
                : matric.includes('gr') ? 'CPE' : matric.includes('gq') ? 'WRE'
                    : matric.includes('gt') ? 'FBE' : matric.includes('gm') ? 'MME'
                        : matric.includes('gn') ? 'CHE' : 'BME'),
        password,
        confirmationCode: token
    })
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
            html: `<h1>Please confirm your account</h1> <p>Please click the link to confirm your account: <a href="http://localhost/confirm/${token}">Confirm</a></p> <p>If you did not request this, please ignore this email</p> <p>Thank you</p>`
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
        const token = jwt.sign({ id: user._id, matric: user.matric, voted: user.voted, department: user.department, level: user.level, verified: user.verified }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).send({ token })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const isVerified = decoded.verified
    if (!isVerified) {
        return res.status(400).send({ message: 'User not verified, Kindly check your email for verification link' })
    } else {
        return res.status(200).send({ message: 'User verified' })
    }
}

const forgotPassword = async (req, res) => {
    const { matric } = req.body
    const user = await User.findOne({ matric })
    if (!user) {
        return res.status(400).send({ message: 'Invalid Matric Number' })
    }
    const token = jwt.sign({ matric: user.matric, department: user.department, level: user.level, role: user.role, verified: user.verified }, process.env.JWT_SECRET, { expiresIn: '1h' })
    const transport = nodemailer.createTransport({
        host: 'smtp.zoho.eu',
        port: 465,
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASS
        }

    })
    const mailOptions = {
        from: 'NUESA',
        to: email,
        subject: 'Reset Password',
        html: `<h1>Reset Password</h1> <p>Please click the link to reset your password: <a href="http://localhost/reset/${token}">Reset</a></p>
            <p>If you did not request this, please ignore this email</p>
            <p>Thank you</p>`
    }
    transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}
const resetPassword = async (req, res) => {
    const { password } = req.body
    const user = await User.findOne({ confirmationCode: req.params.token })
    if (!user) {
        return res.status(400).send({ message: 'Invalid Token' })
    }
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user.save()
    res.status(200).send({ message: 'Password reset successfully' })
}

const logout = async (req, res) => {
    let token = req.headers.authorization.split(' ')[1]
    try {
        token = jwt.sign(' ', ' ', { expiresIn: '1ms' })
        res.status(200).send({ message: 'User logged out' })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

module.exports = { register, login, verifyVoter, resetPassword, forgotPassword, logout }