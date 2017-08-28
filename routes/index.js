const express  = require('express');
const User     = require('../models/user');
const Snippet  = require('../models/snippet')
const mongose  = require('mongoose');
const passport = require('passport');
const router   = express.Router();

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
    res.redirect("/");
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

  Snippet.find({}).sort('author')
  .then(function(snippets) {
    data = snippets;
      res.render('listing', {snippets: snippets});
  })
  .catch(function(err) {
      res.send(err);
  })
});

router.get('/create', requireLogin, function(req, res, next) {
  res.render('create', {username: req.user.username})
})

router.post('/create', function(req, res) {
  let newSnip = {
      author: req.body.author,
      title: req.body.title,
      code: req.body.code,
      notes: req.body.notes,
      language: req.body.language,
      tag: req.body.tag,
    };

      Snippet.create(newSnip)
      .then(function(data) {
        res.redirect('/listing');
      })
      .catch(function(err){
        res.send(err);
      })
})

router.get('/edit/:id' ,function (req, res) {
  let editId = req.params.id;
  let editSnip = data.find(function(snippet) {
    return snippet.id == editId;
  })
  res.render('edit', {snippets: editSnip})
});

router.post('/edit/:id', function(req, res) {
  let editId = req.params.id

  Snippet.update({_id: editId}, {
      author: req.body.author,
      title: req.body.title || null,
      code: req.body.code,
      notes: req.body.notes || null,
      language: req.body.language || null,
      tag: req.body.tag || null,
  }).then(function(data) {
    res.redirect('/listing');
  })
  .catch(function(err) {
    res.send(err);
  })
})







module.exports = router
