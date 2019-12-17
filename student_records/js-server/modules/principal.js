const express = require('express');
const pug = require('pug');
//const mailHandler = require("../modules/ethereal.js"); one-time email modules disabled but it works (maybe just for test!)
const mailHandler = require("./nodemailer.js");
const bcrypt = require('bcrypt');
const db = require('../modules/functions.js');
const { body } = require('express-validator');

var router = express.Router();

router.get("/principal_home", (req, res) => {
    res.render("../pages/principal/principal_home.pug");
});




module.exports = router;