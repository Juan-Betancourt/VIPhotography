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
app.get('/addimg', addImgPage);

// HELPER FUNCTIONS
function addImgPage(req, res) {
    client.query(`SELECT * FROM users`)
        .then(results => {
            console.log(results.rows);
            res.render('./pages/addForm/addimg', { users: results.rows })
        })
}

// LISTENER
app.listen(PORT, () => {
    console.log(`Connected on port ${PORT}`);
});