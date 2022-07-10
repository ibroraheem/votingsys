const express = require('express')
const router = express.Router()
const {createVoter, getVoters,  deleteVoter} = 
router.get('/voters', getVoters)
router.post('/voter', createVoter)
router.delete('/voter/:id', deleteVoter)
module.exports = router