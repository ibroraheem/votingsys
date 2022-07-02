const express = require('express')
const router = express.Router()
const {login, register, verifyVoter, getCandidate, addCandidate, getCandidateVotes, deleteCandidate, updateCandidate, getCandidates} = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.post('/candidate', addCandidate)
router.get('/confirm/:confirmationCode', verifyVoter)
router.delete('/candidate/:id', deleteCandidate)
router.patch('/candidate/:id', updateCandidate)
router.get('/candidates', getCandidates)
router.get('/candidate/id', getCandidate)
module.exports= router
