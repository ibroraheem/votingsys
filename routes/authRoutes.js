const express = require('express')
const router = express.Router()
const {login, register, verifyVoter} = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.get('/confirm/:confirmationCode', verifyVoter)

module.exports= router
