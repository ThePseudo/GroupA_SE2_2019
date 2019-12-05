//'use strict';

const express = require('express');
const pug = require('pug');
const mysql = require('mysql');
const session = require('express-session');

//IMPORTO oggetto rappresentante la sessione.
//Per accedere ->  req.session
//Per accedere a user req.session.user
//Per accedere a campo user es. req.session.user.id
//Per aggiungere campo a user req.session.user.nomecampo = valore 
//Per aggiungere campo a sessione -> req.session.nomecampo = valore

var router = express.Router();

router.use(session({
  secret: 'students', //??
  saveUninitialized: false,
  resave: true,
  httpOnly: false
}));

router.use(/\/.*/, function (req, res, next) {
  try {
    if (req.session.user.user_type != 'teacher') {
      res.redirect("/");
      return;
    } else {
      next();
    }
  } catch (err) {
    res.redirect("/");
  }
});



module.exports = router;