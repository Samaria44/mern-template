require('dotenv').config();

const express = require('express');
const app = express();
const routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

let corsOptions = {
    origin: [
        `http://${process.env.HOST}`,
        `http://${process.env.HOST}:${process.env.PORT}`,
        `http://${process.env.HOST}:5173`, 
        `http://${process.env.HOST}:5500`, 
        `http://127.0.0.1:5500`
    ]
  };

// Middleware
app.use(bodyParser.json());
app.use(cors());
//app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);
app.use('/api/v1/uploads/customer-images', express.static(path.join(__dirname, 'uploads/customer-images')));

module.exports = app;
