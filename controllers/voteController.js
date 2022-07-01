const user = require('../models/user')
const nodemailer = require('nodemailer')

const requestOtp = async (req, res) => {
    const email = user.matric.replace('/', '-') + '@students.unilorin.edu.ng'
    try {
        const user = await user.findOne({ matric })
        if (!user) {
            return res.status(400).send({ message: 'Invalid credentials' })
        }
        const otp = Math.floor(Math.random() * 1000000)
        user.otp = otp
        await user.save()
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'thelma.mayer32@ethereal.email',
                pass: 'RQFCAESNyvY18ad5E1'
            }
        })
        const mailOptions = {
            from: 'info@nuesaunilorin.com',
            to: email,
            subject: 'NUESA Unilorin Voting System',
            text: 'Your OTP is ' + otp
        }
        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })
        res.status(200).send({ message: 'OTP sent to your email' })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

const verifyOtp = async (req, res) => {
    const { matric, otp } = req.body
    try {
        const user = await user.findOne({ matric })
        if (!user) {
            return res.status(400).send({ message: 'Invalid credentials' })
        }
        if (user.otp === otp) {
            user.verified = true
            await user.save()
            res.status(200).send({ message: 'OTP verified' })
        } else {
            res.status(400).send({ message: 'Invalid OTP' })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

const vote = async (req, res) => {
    const { matric } = req.body
    try {
        const user = await user.findOne({ matric })
        if (!user) {
            return res.status(400).send({ message: 'Invalid credentials' })
        }
        if (user.verified) {
            const candidate = await candidate.findOne({ nickname: candidate })
            candidate.votes += 1
            await candidate.save()
            res.status(200).send({ message: 'Voted successfully' })
        } else {
            res.status(400).send({ message: 'OTP not verified' })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }

}

module.exports = {
    requestOtp,
    verifyOtp,
    vote
}