
/* Importing the express module. */
const express = require('express')
/* Creating a router object that can be used to handle requests. */
const router = express.Router()

/* This is destructuring. It is pulling the getCandidates function from the candidateController.js
file. */
const { getCandidates } = require('../controllers/candidateController')

/* This is a route handler. It is telling the server to respond to a GET request to the /candidates
endpoint with the getCandidates function. */
router.get('/candidates', getCandidates)

/* Exporting the router object so that it can be used in other files. */
module.exports = router