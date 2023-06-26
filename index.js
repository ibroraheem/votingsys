const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const connectDB = require('./config/db')
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
require('dotenv').config()
connectDB()

app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept', 'Access-Control-Allow-Headers', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
    }
))
app.use(bodyParser.json())
app.use(express.json())
app.get('/', (req, res) => {
    res.status(200).send('Hello World')
})
app.use('', require('./routes/authRoutes'))
app.use('', require('./routes/voteRoutes'))
app.use('', require('./routes/nomineeRoutes'))
app.use('', require('./routes/candidateRoutes'))
app.use('/admin', require('./routes/adminRoutes'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})