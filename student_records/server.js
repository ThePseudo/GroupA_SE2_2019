'use strict';

const express = require('express');
const fs = require('fs');
const https = require('https');
const pug = require('pug');

// Constants
const PORT = 8000;
const HOST = '0.0.0.0';

// App
const app = express();
app.set('view engine', 'pug');


// Main page
app.get('/', (req, res) => {
    const compiledPage = pug.compileFile("pages/home.pug");
    res.end(compiledPage());

});

app.get("/style", (req, res) => {
    var page = fs.readFileSync("pages/base/style.css");
    res.end(page);
});


// Page not found
app.get('/*', (req, res) => {
    const compiledPage = pug.compileFile("pages/base/404.pug");
    res.end(compiledPage());
});

/*
https.createServer({
    key: "", //fs.readFileSync('server.key'),
    cert: "" //fs.readFileSync('server.cert')
}, app)
    .listen(8000, function () {
        console.log(`HTTPS Running on http://${HOST}:${PORT}`);
    })
*/

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
