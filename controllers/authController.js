const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
require('dotenv').config()


/**
 * It creates a new user and sends a confirmation email to the user's email address.
 * </code>
 * @param req - request
 * @param res - the response object
 */
const register = async (req, res) => {
    try {
        const { name, matric, password, level } = req.body
        var email = matric.replace('/', '-') + '@students.unilorin.edu.ng'
        const isExisting = await User.findOne({ matric })
        if (isExisting) return res.status(400).send({ message: `Dear ${isExisting.name}, you have already registered` })
        const user = new User({ name, matric, password, email, level })
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        const confirmationCode = Math.floor(Math.random() * 1000000)
        user.confirmationCode = confirmationCode.toString()
        await user.save()
        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.MAIL,
            to: email,
            subject: 'Email Confirmation',
            html: `<h1>Hello ${name},</h1>
            <p>Thank you for registering for the 2021/2022 NUESA Election. here is your OTP:</p>
            <h2>${confirmationCode}</h2>
            <p>Enter this OTP to verify your email address.</p>
            <p>Thank you.</p>,
            <p>NISEC 2021/2022</p>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })

    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/**
 * It finds a user with the confirmation code that matches the token in the url, then changes the
 * user's status to 'verified' and saves the user.
 * @param req - request
 * @param res - the response object
 */
const verifyVoter = async (req, res) => {
    const { confirmationCode } = req.body
    try {
        const user = await User.findOne(confirmationCode)
        if (!user)
            return res.status(400).send({ message: 'Invalid confirmation code' })
        user.status = 'verified'
        await user.save()
        return res.status(200).send({ message: 'User verified successfully' })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/**
 * It checks if the user is verified, if not, it returns a message, if yes, it returns a message.
 * </code>
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 * @returns The token is being returned.
 */
const login = async (req, res) => {
    const { matric, password } = req.body
    try {
        const user = await User.findOne({ matric })
        if (!user) {
            return res.status(400).send({ message: 'Invalid Matric Number' })
        }

        const isMatch = bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid Password' })
        }

        const token = jwt.sign({ id: user._id, matric: user.matric, voted: user.voted, department: user.department, level: user.level, verified: user.verified }, process.env.JWT_SECRET, { expiresIn: '1h' })
        return res.status(200).json({ message: 'Logged in successfully', token })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/**
 * It takes the matric number from the request body, finds the user with that matric number, signs a
 * token with the user's matric number, department, level, role and verified status, sends the token to
 * the user's email address and then sends a response to the client.
 * </code>
 * @param req - request object
 * @param res - the response object
 * @returns The token is being returned
 */
const forgotPassword = async (req, res) => {
    const { matric } = req.body
    const user = await User.findOne({ matric })
    if (!user) {
        return res.status(400).send({ message: 'Invalid Matric Number' })
    }
    const token = jwt.sign({ matric: user.matric, department: user.department, level: user.level, role: user.role, verified: user.verified }, process.env.JWT_SECRET, { expiresIn: '1h' })
    const transport = nodemailer.createTransport({
        host: 'smtp.zoho.com',
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

/**
 * It takes a password from the request body, finds a user with the confirmation code from the request
 * params, if the user exists, it generates a salt, hashes the password, saves the user, and sends a
 * response.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The user object
 */
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

/**
 * It takes the token from the request header, signs it with a secret, and sets the expiration to 1
 * second.
 * @param req - The request object.
 * @param res - The response object.
 */
const logout = async (req, res) => {
    try {
        let token = req.headers.authorization.split(' ')[1]
        token = jwt.sign({ token: token }, 'secret', { expiresIn: '1s' })
        res.status(200).send({ token, message: 'Logged out' })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }

}

/* Exporting the functions in the file. */
module.exports = { register, login, verifyVoter, resetPassword, forgotPassword, logout }