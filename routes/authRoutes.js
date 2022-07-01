const express = require('express')
const router = express.Router()
const {login, register, addCandidate, deleteCandidate, updateCandidate, getCandidates} = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.post('/candidate', addCandidate)
router.delete('/candidate/:nickname', deleteCandidate)
router.patch('/candidate/:nickname', updateCandidate)
router.get('/candidates', getCandidates)
module.exports= router
