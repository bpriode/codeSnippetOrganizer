const express = require('express');
const User = require('../models/user');
const mongose = require('mongoose');
const passport = require('passport');
const router = express.Router();

let data = [];


const requireLogin = function (req, res, next) {
  if (req.user) {
    // console.log(req.user)
    next()
  } else {
    res.redirect('/');
  }
};

const login = function (req, res, next) {
  if (req.user) {
    res.redirect("/listing")
  } else {
    next();
  }
};

router.get("/", login, function(req, res) {

  res.render("login", {
      messages: res.locals.getMessages()
  });
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/listing',
    failureRedirect: '/',
    failureFlash: true
}));

router.get("/signup", function(req, res) {
  res.render("signup", {users: data});
});

router.post("/signup", function(req, res) {
  User.create({
    username: req.body.username,
    password: req.body.password,
  })
  .then(function(data) {
    // console.log(data);
    res.redirect("/login");
  })
  .catch(function(err) {
    // console.log(err);
    res.redirect("/signup");
  });
});


router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

let getData = function (db, callback) {
  let users = db.collection('users');

    User.find({}).toArray().sort({'name': 1}).then(function(users) {
        data = users;
        callback();
    });
};

router.get('/listing', function (req, res) {

  User.find({}).sort('name')
  .then(function(users) {
    data = users;
      res.render('listing', {users: users});
    // next();
  })
  // .catch(function(err) {
  //   // console.log(err);
  //   next(err);
  // })
});









module.exports = router
