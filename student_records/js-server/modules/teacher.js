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

// TEMP
router.get("/teacher_home", (req, res) => {
  res.redirect("/teacher/topics");
});

router.get("/topics", (req, res) => {
  var fullName = req.session.user.first_name + " " + req.session.user.last_name;
  const compiledPage = pug.compileFile("../pages/teacher/teacher_coursetopic.pug");
  var today = new Date();
  var dayString = today.getDate();
  var monthString = today.getMonth() + 1;
  if (dayString < 10) dayString = '0' + today.getDate();
  if (monthString < 10) monthString = '0' + (today.getMonth() + 1);
  var todayString = today.getFullYear() + "-" + monthString + "-" + dayString;
  res.end(compiledPage({
    fullName: fullName,
    dateString: todayString
  }));
});


module.exports = router;