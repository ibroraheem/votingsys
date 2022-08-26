const Admin = require('../models/admin')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

const register = async (req, res) => {
    try {
        const admin = await Admin.create(req.body)
        res.status(200).json({ admin })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email })
        if (!admin) {
            res.status(400).send({ message: 'Invalid email or password' })
        } else {
            const token = jwt.sign({ id: admin._id, role: 'admin' }, secret, { expiresIn: '1h' })
            res.status(200).json({ token })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

module.exports = { register, login }