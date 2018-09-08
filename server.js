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

// HELPER FUNCTIONS 
const renderIndex = (req, res) => {
  res.render('index')
}
const getAllImages = (req, res) => {
  let SQL = `SELECT img_data_id, img_url FROM imgdatas;`;
  client.query(SQL)
  .then(results => {
    res.render('test', {allImages : results.rows})
    .catch(err => consol.log(err, res))
  });
}
const getClientImages = (req, res) => {
  let SQL = `SELECT img_data_id, users_id, lastname, img_url
  FROM imgdatas INNER JOIN users ON imgdatas.user_id = users.user_id 
  WHERE user_id = ($1);`;
  let params = [req.params.thisId];
  client.query(SQL, params)
  .then(results => {
    // console.log(results.rows);
    res.render('test', {allImages : results.rows})
    .catch(err => console.log(err, res))
  });
};

// ROUTES
app.get('/', renderIndex);
app.get('/images', getAllImages);
app.get('/images:thidId', getClientImages);

// LISTENER
app.listen(PORT, () => {
  console.log(`Connected on port ${PORT}`);
});