'use strict'

// DEPENDANCIES
require('dotenv').config();
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const pg = require('pg');
// require('pg').defaults.ssl = true;
const PORT = process.env.PORT;

// DEPENDANCY SETTINGS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// DATABASE CLIENT
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
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
  let SQL = `SELECT imgdata_id, img_url FROM imgdatas;`;
  client.query(SQL)
  .then(results => {
    res.render('test', {allImages : results.rows})
    .catch(err => console.log(err, res))
  });
}
const getClientImages = (req, res) => {
  let SQL = `SELECT imgdata_id, user_id, users_id, lastname, img_url
  FROM imgdatas INNER JOIN users ON imgdatas.users_id = users.user_id 
  WHERE user_id = ($1);`;
  let params = [req.params.thisId];
  client.query(SQL, params)
  .then(results => {
    console.log(results.rows);
    res.render('test', {allImages : results.rows})
    .catch(err => console.log(err, res))
  });
};

// ROUTES
<<<<<<< HEAD
app.get('/', renderIndex);
app.get('/images', getAllImages);
app.get('/images:thisId', (req, res) => {
  let SQL = `SELECT imgdata_id, user_id, users_id, lastname, img_url
  FROM imgdatas INNER JOIN users ON imgdatas.users_id = users.user_id 
  WHERE users_id = ($1);`;
  let thisId = [req.params.thisId];
  client.query(SQL, thisId)
  .then(results => {
    console.log(results.rows);
    res.render('test', {allImages : results.rows})
    .catch(err => console.log(err, res))
  });
});
=======

//This Path is a test path to display all the images for now. Possibly create a path just for the admin to see all the images in the database.
app.get('/adminpage', (req, res) => {
  client.query(`SELECT img_url FROM imgdatas`)
  .then(results =>{
      console.log(results.rows);
      res.render('./pages/clientAccess/clientView', {img: results.rows} )
      // added the 2 tables into the database, This is to test if the stuffs were rendering correctly with the tables.
  })
  .catch(err => handleError(err, res));
});

// This path need a show.ejs to show only user's images.
app.post('/client', renderUserImg);

// This function will be only adding images into for the user already exist in our database.
app.get('/addimg', addImgPage);
app.post('/addimg', postImg);

// HELPER FUNCTIONS

function renderUserImg(req, res) {
  let{lastname, pin} = req.body;
  client.query(`SELECT user_id
  FROM users
  WHERE lastname = '${req.body.lastname}' AND pin = ${req.body.pin}`)
  .then(results =>{
      console.log(results.rows[0].user_id);
      let userid = results.rows[0].user_id;
      let SQL = `SELECT img_url FROM imgdatas WHERE users_id = $1;`
      let values = [userid]
      client.query(SQL, values)
      .then(data =>{
        console.log(data.rows)
        res.render('./pages/clientAccess/clientView', {img: data.rows} )
      })
      .catch(err => handleError(err, res));
  })
  .catch(err => handleError(err, res));
}

function addImgPage (req, res) {
  client.query(`SELECT * FROM users`)
  .then(results => {
    console.log(results.rows);
    res.render('./pages/addForm/addimg', {users: results.rows})
  })
}

function postImg (req, res) {
  console.log(req.body.img_url);
  console.log(req.body.user_id);
  let SQL = `INSERT INTO imgdatas(img_url, users_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`;
  let values = [req.body.img_url, req.body.user_id];
  client.query(SQL, values)
  .then(()=>{
    addImgPage(req, res);
    console.log('You have successfully added a image into the DATABASE.')
  })
}

>>>>>>> 4006236da4fb1e57930e848e99ca974645758f55

// LISTENER
app.get('*', (request, response) => response.render('pages/error', {}));

app.listen(PORT, () => {
<<<<<<< HEAD
  console.log(`Connected on port ${PORT}`);
});
=======
    console.log(`Connected on port ${PORT}`);
});

function handleError(error, response) {
  response.render('pages/error', {error: error});
}
>>>>>>> 4006236da4fb1e57930e848e99ca974645758f55
