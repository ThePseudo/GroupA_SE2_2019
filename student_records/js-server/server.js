//'use strict';

const express = require('express');
const session = require('express-session');
const fs = require('fs');
const https = require('https');
const http = require('http');
const pug = require('pug');
const bodyParser = require('body-parser');

// App
const app = express();
app.set('view engine', 'pug');
app.set('views', './pages');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'students',
    saveUninitialized: false,
    resave: true,
    httpOnly: false
}));

const adminPages = require('./modules/admin.js');
const parentPages = require('./modules/parent.js');
const auth_router = require("./modules/Auth_manager.js");

// Constants
const HTTPPORT = 8000;
const HTTPSPORT = 8080;
const HOST = '0.0.0.0';

// other routers
module.exports = function (app) {
    app.use('/action/*', require('./modules'));
};

//mount external route, now I can access to external route via ex. /admin/routename inside adminPages module .js
app.use('/admin', adminPages);
app.use('/parent', parentPages);
app.use('/auth_router', auth_router);

const options = {
    key: fs.readFileSync("./certs/localhost.key"),
    cert: fs.readFileSync("./certs/localhost.cert")
};

// Main page
app.get('/', (req, res) => {
    const compiledPage = pug.compileFile("pages/home.pug");
    res.end(compiledPage());
});

// TEMP
app.get("/teacher/teacher_home", (req, res) => {
    res.redirect("/topics");
});

app.get("/admin/admin_home", (req, res) => {
    res.redirect("/admin/enroll_parent");
});

app.get("/style", (req, res) => {
    const page = fs.readFileSync("pages/base/style.css");
    res.end(page);
});

app.get("/topics", (req, res) => {
    const compiledPage = pug.compileFile("pages/topics.pug");
    res.end(compiledPage());
});

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

app.post('/*', (req, res) => {
    fs.readFile(req.path, (err, data) => {
        if (err) {
            const compiledPage = pug.compileFile("pages/base/404.pug");
            res.end(compiledPage());
        }
        res.end(data);

    })
});

//app.listen(PORT, HOST);


const httpApp = express();
httpApp.get("*", (req, res) => {
    res.redirect("https://" + req.hostname + ":" + HTTPSPORT + req.path);
});
http.createServer(httpApp).listen(HTTPPORT);
https.createServer(options, app).listen(HTTPSPORT);

console.log(`Running on http://${HOST}:${HTTPPORT}`);
console.log(`Running on https://${HOST}:${HTTPSPORT}`);