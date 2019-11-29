const express = require('express');
const pug = require('pug');

var router = express.Router();

router.use('/:id', function(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    next();
}, function(req, res, next) {
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