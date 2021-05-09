const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/user");
const bcrypt = require('bcrypt');
const { body, validationResult } = require("express-validator");

// ---------------------------------register page---------------------------------

router.get("/registerPage", function (req, res) {
  let usernameErr,f_nameErr,l_nameErr,passwordErr;
  if (req.session.registerErr) {
    usernameErr = req.session.registerErr.find(el => el.param === 'username');
    f_nameErr = req.session.registerErr.find(el => el.param === 'f_name');
    l_nameErr = req.session.registerErr.find(el => el.param === 'l_name');
    passwordErr = req.session.registerErr.find(el => el.param === 'password');
    if (usernameErr) {
      usernameErr = 'username must include atleast 3 charecters'
    }
    if (f_nameErr) {
      f_nameErr = 'first name must include atleast 3 charecters'
    }
    if (l_nameErr) {
      l_nameErr = 'last name must include atleast 2 charecters'
    }
    if (passwordErr) {
      passwordErr = 'password must include atleast 8 charecters'
    }
  } else if (req.session.existUserErr) {
    res.render('register', {usernameErr : req.session.existUserErr, f_nameErr , l_nameErr , passwordErr});
    return req.session.destroy();
  }
  res.render('register', {usernameErr , f_nameErr , l_nameErr, passwordErr});
  return req.session.destroy();

});

// ********************************************************************************

// -----------------------------------login page-----------------------------------

router.get("/login", function (req, res) {
  res.render("login", {loginErr : req.session.loginErr});
  req.session.destroy();

});

router.post("/userLogin", function(req, res) {

  User.findOne({username : req.body.username}, function(err, user) {
    if (err) return res.status(500).send('Internal Server Error :(');

    if (!user) {
      req.session.loginErr = 'user not found';
      return res.redirect('/auth/login')
    } else {
      bcrypt.compare(req.body.password, user.password, function(err, result) {

        if (err) return res.status(500).send("Internal server error :(");

        if (!result) {
          req.session.loginErr = 'password incorrect';
          return res.redirect('/auth/login')
        }
  
  
        req.session.user = user;
  
        return res.redirect('/dashboard');
    });
    }
  })

})

// ********************************************************************************

// ---------------------------------register user----------------------------------

router.post(
  "/register",
  body("username").isLength({ min: 3 }),
  body("f_name").isLength({ min: 3 }),
  body("l_name").isLength({ min: 2 }),
  body("password").isLength({ min: 8 }),
  function (req, res) {

// ----------------------------creating user validation----------------------------

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.registerErr = errors.errors;
      return res.redirect('/auth/registerPage');
    }

// ********************************************************************************
// -----------------------------checking if user exists----------------------------

    User.findOne({username : req.body.username.trim()}, function(err, user) {
      if (err) {
        return res.status(500).send("Internal server error :(");
      }

      if (user) {
        req.session.existUserErr = 'username already exists';
        return res.redirect('/auth/registerPage');

// ********************************************************************************

      } else {

// ----------------------------------create user----------------------------------

        const newUser = new User({
          username : req.body.username,
          password : req.body.password,
          f_name : req.body.f_name,
          l_name : req.body.l_name,
          phonenumber : req.body.phonenumber,
          gender : req.body.gender
        });

        newUser.save((err)=> {
          if (err) return res.status(500).send('Internal Server Error :(');
          return res.redirect('/auth/login');
        })
      }

    })

// ********************************************************************************

  }
);

module.exports = router;
