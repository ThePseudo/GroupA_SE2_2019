const express = require('express');
const pug = require('pug');

//IMPORTO oggetto rappresentante la sessione.
//Per accedere ->  SESSION.sessioneData
//Per accedere a user SESSION.sessioneData.user
//Per accedere a campo user es. SESSION.sessioneData.user.id
//Per aggiungere campo a user SESSION.sessioneData.user.nomecampo = valore 
//Per aggiungere campo a sessione -> SESSION.sessioneData.nomecampo = valore
var SESSION = require("./Auth_manager.js"); 

var router = express.Router();

router.use('/:id', function (req, res, next) {
    console.log('Request URL:', req.originalUrl);
    next();
}, function (req, res, next) {
    console.log('Request Type:', req.method);
    next();
});

router.get('/parents', (req, res) => {
    res.end("Hello, parents!");
});

router.get('/register_parent', (req, res) => {
    res.end("Hello, register parents!");
});

router.get("/enroll", (req, res) => {
    const compiledPage = pug.compileFile("../pages/enroll.pug");
    res.end(compiledPage());
});

module.exports = router;