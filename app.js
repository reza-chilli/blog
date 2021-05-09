const express = require('express');
const app = express();
const api = require('./routes/api');

const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');


// -------------------------------mongoose connection------------------------------

mongoose.connect('mongodb://localhost:27017/blog', {
  useNewUrlParser: true,
  useUnifiedTopology : true,
  useCreateIndex : true
});

// ********************************************************************************

// ----------------------------------ejs setting-----------------------------------

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// ********************************************************************************


// --------------------------------session midleware-------------------------------

app.use(cookie());
app.use(session({
    key: 'user_sid',
    secret: 'mysecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
  }));
// ********************************************************************************

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/views')));

app.use('/',api);





app.listen(8080, function() {
    console.log('app is running on port 8080....');
})