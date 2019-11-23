const express = require('express');
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

module.exports = router;