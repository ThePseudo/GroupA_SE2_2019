'use strict';

const express = require('express');
const fs = require('fs');

// Constants
const PORT = 8000;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
    var page = '';
    fs.readFile("pages/base/base.html", function (err, data) {
        page = data;

        // HTML here!

        fs.readFile("pages/base/end.html", function (err, data) {
            page += data;
            res.end(page);
        });
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);