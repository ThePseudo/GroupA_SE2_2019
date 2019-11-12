'use strict';

const express = require('express');
const session = require('express-session')
const fs = require('fs');
const https = require('https');
const pug = require('pug');
const bcrypt = require('bcrypt');

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
    const page = fs.readFileSync("pages/base/style.css");
    res.end(page);
});

app.get("/marks", (req, res) => {
    const compiledPage = pug.compileFile("pages/student_marks.pug");
    var marks = [];
    // TODO: get marks from database

    marks[0] = {
        date: new Date(2019, 9, 10),
        subject: "History",
        mark: "6"
    };

    marks[1] = {
        date: new Date(2019, 10, 12),
        subject: "Math",
        mark: "8"
    }

    marks.sort((a, b) => {
        return b.date - a.date;
    });

    res.end(compiledPage({
        // TODO: student name should be taken from DB
        student_name: "Marco Pecoraro",
        student_marks: marks
    }));
})

// Page not found
app.get('/*', (req, res) => {
    fs.readFile(req.path, (err, data) => {
        if (err) {
            const compiledPage = pug.compileFile("pages/base/404.pug");
            res.end(compiledPage());
        }
        res.end(data);

    })
});

// HTTPS

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
