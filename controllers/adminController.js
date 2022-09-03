const Admin = require('../models/admin')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET
/**
 * It creates a new admin user in the database.
 * @param req - The request object.
 * @param res - The response object.
 */

const register = async (req, res) => {
    const { username, email, password } = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    try {
        const isExisting = await Admin.find({})
        if (isExisting.length > 0) {
            return res.status(400).send({ message: 'Admin already exists' })
        }
        const admin = new Admin({
            username,
            email,
            password: hashedPassword
        })
        await admin.save()
        res.status(201).json({ message: 'Admin created successfully', admin: admin.username })

    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/**
 * It takes the email and password from the request body, checks if the email exists in the database,
 * if it does, it creates a token and sends it back to the user.
 * @param req - The request object.
 * @param res - The response object.
 */
const login = async (req, res) => {
   const {username, password} = req.body
    try{
        const admin = await Admin.findOne({username})
        if(!admin){
            return res.status(400).send({message: 'Admin does not exist'})
        }
        const isPasswordCorrect = await bcrypt.compare(password, admin.password)
        if(!isPasswordCorrect){
            return res.status(400).send({message: 'Invalid password'})
        }
        const token = jwt.sign({username: admin.username, role: admin.role}, secret)
        res.status(200).json({message: 'Login successful', token})
    }catch(error){
        res.status(400).send({message: error.message})
    }
}

module.exports = { register, login }