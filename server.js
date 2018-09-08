'use strict'

// DEPENDANCIES
require('dotenv').config();
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const pg = require('pg');
const PORT = process.env.PORT;

// DEPENDANCY SETTINGS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// DATABASE CLIENT
const client = new pg.Client(process.env.DATABASE_URL);
// client.connect();
client.on('error', error => {
    console.error(error);
});

// PUBLIC FOLDER ACCESS
app.use(express.static('./public'));

// ROUTES
app.get('/', (req, res) => {
    res.render('index');
});
// HELPER FUNCTIONS

// LISTENER
app.listen(PORT, () => {
    console.log(`Connected on port ${PORT}`);
});