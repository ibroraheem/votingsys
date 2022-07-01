const express = require('express')
const router = express.Router()
const {requestOtp, verifyOtp, vote} = require('../controllers/voteController')

router.post('/requestotp', requestOtp)
router.post('/verifyotp', verifyOtp)
router.post('/vote', vote)

module.exports = router