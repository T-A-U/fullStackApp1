// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2021b', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

// //code taken from previous project "own demo"
// app.get('/profile', (req, res) => {
//   db.collection('Comments').find().toArray((err, result) => {
//     if (err) return console.log(err)
//     let comments = []
//     result.forEach((e,i) => {
//       comments.push(result[i]['comment'])
//     })
    
//     res.render('profile.ejs', {comments: result})
//   console.log(result)
//   })
// })

app.post('/profile', (req, res) => { //not sure which route this goes to, /Comments or not
  db.collection('Comments').insertOne({owner: req.body.owner, comment: req.body.comment, game: req.body.game},
    // upsert: true  
    (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/messages', (req, res) => {
  let thumbLogic //added variable for thumbLogic
  // if( req.body.thumbDown){
  if(Object.keys(req.body)[2] == 'thumbDown'){//previous version didnt work, changed to object.keys
    thumbLogic = req.body.thumbDown -1
    //conditional for the put for thumbUp and thumbDown
  // }else if (req.body.thumbUp){
  }else if(Object.keys(req.body)[2]=='thumbUp'){//previous version didnt work, changed to object.keys
    thumbLogic =req.body.thumbUp +1 //plus 1 for thumb up in dom
  }
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      // thumbUp:req.body.thumbUp + 1
      //changing previous line by commenting it out
      thumbUp : thumbLogic
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/messages', (req, res) => {
  db.collection('RandomGames').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})


//allow user to write a note for a specific game, be able to edit that note or delete
//sent to backend database/attached to game

//1. create html form to collect user input. complete
// 2. Create frontend logic/javascript to collect form inputs and make fetch request to api
// 3. create route in server to receive request with form data
// 4. make db query to find game(already happening) then query db to find associated comments
// 5. send response to client of game(already happening) and associated comments
// 6. show comments and game on client side
// 7. if user owns the comment allow them to edit or delete
// 8. add delete button, javascript to fetch delete and remove from front end, create route in server to handle delete request
// 9. Do step 8 but for editing aka updating the comment