const express = require('express')
const router = express.Router()
const { nominate} = require('../controllers/nomineesController')

router.post('/nominee', nominate)

module.exports = router