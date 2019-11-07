'use strict';

const express = require('express');
const fs = require('fs');
const https = require('https');

// Constants
const PORT = 8000;
const HOST = '0.0.0.0';

// App
const app = express();

// Main page
app.get('/', (req, res) => {
    var page = '';
    page = fs.readFileSync("pages/base/base.html");
    page += "\n";

    // HTML here!
    page += "<H1>Title</H1>";

    page += "\n"
    page += fs.readFileSync("pages/base/end.html");
    res.end(page);
});




// Page not found
app.get('/*', (req, res) => {
    var page = '';
    page = fs.readFileSync("pages/base/base.html");
    page += "\n";

    // HTML here!
    page += "<H1>404: PAGE NOT FOUND</H1>";

    page += "\n"
    page += fs.readFileSync("pages/base/end.html");
    res.end(page);
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
