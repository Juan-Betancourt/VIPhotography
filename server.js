'use strict'

// DEPENDANCIES
require('dotenv').config();
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const pg = require('pg');
const superagent = require('superagent')
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

// ROUTES
//This Path is a test path to display all the images for now. Possibly create a path just for the admin to see all the images in the database.
app.get('/', (req, res) => res.render('index'));
app.get('/adminpage', adminAccess);

//About us page
app.get('/about', (req,res) => res.render('./pages/about/creators'))

// This path need a show.ejs to show only user's images.
app.get('/client', (req,res) => res.render('./pages/clientAccess/clientView'));
app.post('/client', renderUserImg);

// This function will be only adding images into for the user already exist in our database.
app.get('/addimg', addImgPage);
app.post('/addimg', postImg);

app.get('/samplepics', renderSamplepic);
app.post('/samplepics', readAPI);

// HELPER FUNCTIONS
function addImgPage(req, res) {
    client.query(`SELECT * FROM users`)
        .then(results => {
            console.log(results.rows);
            res.render('./pages/addForm/addimg', { users: results.rows })
        })
}

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
      res.render('./pages/clientAccess/clientView', {img: data.rows})
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

function adminAccess (req, res) {
  client.query(`SELECT img_url FROM imgdatas`)
  .then(results =>{
      console.log(results.rows);
      res.render('./pages/clientAccess/adminView', {img: results.rows} )
      // added the 2 tables into the database, This is to test if the stuffs were rendering correctly with the tables.
  })
  .catch(err => handleError(err, res));
}

function renderSamplepic (req,res){
  res.render("./pages/samplePic/eventsample")
}

function readAPI (req, res) {
  console.log(req.body.eventtype)
  let url = `http://viphotographyapi.herokuapp.com/${req.body.eventtype}`;
  superagent(url).query()
  .then(data =>{
    console.log(data.body);
      res.render('./pages/samplePic/eventsample', {img: data.body});
  })
}

// LISTENER
app.get('*', (request, response) => response.render('pages/error', {}));

app.listen(PORT, () => {
    console.log(`Connected on port ${PORT}`);
});

function handleError(error, response) {
  response.render('pages/error', {error: error});
}