/* Importing the Nominee model, the jsonwebtoken library, and the secret key from the environment
variables. */
const Nominee = require('../models/nominees')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET
const Candidates = require('../models/candidates')


/**
 * It creates a new nominee in the database using the data sent in the request body.
 * @param req - The request object.
 * @param res - the response object
 */
const nominate = async (req, res) => {
    try {
        const { firstName, lastName, otherNames, matricNumber, department, post, nickname, cgpa, level, image } = req.body
        const nominee = await Nominee.create({
            firstName,
            lastName,
            otherNames,
            matricNumber,
            department,
            post,
            nickname,
            cgpa,
            level,
            image
        })
        res.status(201).json({ nominee })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/**
 * It gets all the nominees from the database and sends them to the client.
 * @param req - request
 * @param res - the response object
 */
const getNominees = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try {
            const nominees = await Nominee.find({})
            res.status(200).json({ nominees })
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
    } else {
        res.status(400).send({ message: 'You are not authorized to view this page' })
    }
}

/**
 * It gets a nominee by id, but only if the user is an admin.
 * @param req - request
 * @param res - the response object
 */
const getNominee = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try {
            const nominee = await Nominee.findById(req.params.id)
            res.status(200).json({ nominee })
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
    } else {
        res.status(400).send({ message: 'You are not authorized to view this page' })
    }
}

/**
 * It takes a request, checks if the user is an admin, if they are, it updates the nominee with the id
 * in the request params with the body of the request.
 * @param req - the request object
 * @param res - the response object
 */
const updateNominee = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try {
            const nominee = await Nominee.findByIdAndUpdate(req.params.id, req.body, { new: true })
            res.status(200).json({ nominee })
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
    } else {
        res.status(400).send({ message: 'You are not authorized to view this page' })
    }
}

/**
 * It confirms a nominee as a candidate and sends an email to the nominee.
 * @param req - request
 * @param res - the response object
 */
const confirmNomination = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try {
            const nominee = await Nominee.findById(req.params.id)
            if (nominee) {
                const candidate = await Candidates.create({
                    firstName: nominee.firstName,
                    lastName: nominee.lastName,
                    otherNames: nominee.otherNames,
                    matric: nominee.matricNumber,
                    nickname: nominee.nickname,
                    post: nominee.post,
                    level: nominee.level,
                    department: nominee.department,
                    image: nominee.image,
                })
                const email = nominee.matricNumber + '@students.unilorin.edu.ng'
                const transport = nodemailer.createTransport({
                    host: 'smtp.zoho.eu',
                    port: 465,
                    auth: {
                        user: process.env.MAIL,
                        pass: process.env.PASS
                    }

                })
                const mailOptions = {
                    from: process.env.MAIL,
                    to: email,
                    subject: 'Congratulations',
                    text: `Congratulations ${nominee.firstName} ${nominee.lastName}, you have been confirmed as a candidate for the ${nominee.post} post in the 2020/2021 Unilorin NUESA Election.`
                }
                transport.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(info)
                    }
                })
                res.status(200).json({ candidate })
            } else {
                res.status(400).send({ message: 'Nominee not found' })
            }
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
    }
}

/**
 * It rejects a nomination and sends an email to the nominee.
 * @param req - request
 * @param res - the response object
 */
const rejectNomination = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try {
            const nominee = await Nominee.findById(req.params.id)
            const email = nominee.matricNumber + '@students.unilorin.edu.ng'
            const transport = nodemailer.createTransport({
                host: 'smtp.zoho.eu',
                port: 465,
                auth: {
                    user: process.env.MAIL,
                    pass: process.env.PASS
                }

            })
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Re: Nomination',
                text: `Dear ${nominee.firstName} ${nominee.lastName}, you have been disqualified from the 2020/2021 NUESA Elections. Kindly check the NUESA Notice board for details.`
            }
            transport.send(mailOptions, (err, info) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(info)
                }
            })

        } catch (error) {
            res.status(404).send({ message: error.message })
        }
    }
}

/* Exporting the functions to be used in other files. */
module.exports = { nominate, getNominees, getNominee, updateNominee, confirmNomination, rejectNomination }

