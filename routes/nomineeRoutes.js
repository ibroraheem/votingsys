const express = require('express')
const router = express.Router()
const { nominate, getNominees, getNominee, updateNominee } = require('../controllers/nomineeController')

router.post('/nominee', nominate)
router.get('/nominees', getNominees)
router.get('/nominee/:id', getNominee)
router.patch('/nominee/:id', updateNominee)

module.exports = router