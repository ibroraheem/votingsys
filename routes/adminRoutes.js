const express = require('express')
const router = express.Router()

const {login, register} = require('../controllers/adminController')

router.post('/register', register)
router.post('/login', login)