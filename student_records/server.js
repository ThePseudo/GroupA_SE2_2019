'use strict';

const express = require('express');
const fs = require('fs');

// Constants
const PORT = 8000;
const HOST = '0.0.0.0';

// App
const app = express();

// Main page
app.get('/', (req, res) => {
    var page = '';
    fs.readFile("pages/base/base.html", function (err, data) {
        page = data + "\n";

        // HTML here!
        page += "<H1>Title</H1>";

        fs.readFile("pages/base/end.html", function (err, data) {
            page += ("\n" + data);
            res.end(page);
        });
    });
});




// Page not found
app.get('/*', (req, res) => {
    var page = '';
    fs.readFile("pages/base/base.html", function (err, data) {
        page = data + "\n";

        // HTML here!
        page += "<H1>404: Page not found!</H1>";

        fs.readFile("pages/base/end.html", function (err, data) {
            page += ("\n" + data);
            res.end(page);
        });
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);