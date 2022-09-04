/* Importing the express module. */
const express = require('express')
const router = express.Router()

/* Importing the functions from the controller files. */
const { login, register } = require('../controllers/adminController')
const { getVoters, deleteVoter, blacklistVoter } = require('../controllers/voterController')
const { getCandidates, getCandidate, addCandidate, getCandidateVotes, getCandidateVoters, updateCandidate, deleteCandidate } = require('../controllers/candidateController')
const { getNominees, getNominee, updateNominee, confirmNomination } = require('../controllers/nomineesController')

/* Importing the functions from the controller files. */
router.post('/register', register)
router.post('/login', login)
router.get('/voters', getVoters)
router.delete('/voter/:id', deleteVoter)
router.patch('/voter/:id', blacklistVoter)
router.get('/candidates', getCandidates)
router.get('/candidate/:id', getCandidate)
router.get('/candidate-votes', getCandidateVotes)
router.post('/candidate', addCandidate)
router.get('/candidate-voters', getCandidateVoters)
router.patch('/candidate/:id', updateCandidate)
router.delete('/candidate/:id', deleteCandidate)
router.get('/nominees', getNominees)
router.get('/nominee/:id', getNominee)
router.patch('/nominee/:id', updateNominee)
router.post('/nominee/:id', confirmNomination)


/* Creating a route for the register function. */
module.exports = router