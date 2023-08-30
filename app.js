const express = require('express');

let PORT = 3000

const dotenv = require('dotenv');
dotenv.config()

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const userRoutes = require('./Routes/user');

app.use(userRoutes)

app.listen(PORT, () => {
    console.log('App running on port', PORT)
})
