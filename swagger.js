const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./server.js']; // Specify the file(s) that contain your API routes

swaggerAutogen(outputFile, endpointsFiles);
