//'use strict';

const express = require('express');
const session = require('express-session');
const fs = require('fs');
const https = require('https');
const http = require('http');
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
const auth_router = require('./modules/Auth_manager.js');
const teacherPages = require('./modules/teacher.js');
const officerPage = require('./modules/officer.js');
const principalPage = require('./modules/principal.js');

// Constants
const HTTPPORT = 8000;
const HTTPSPORT = 8080;
const HOST = 'localhost';

//fix for favicon.ico request
app.get('/favicon.ico', (req, res) => res.status(204));

app.use('/:path', (req, res, next) => {
    const acceptedPaths = ["admin", "parent", "teacher", "officer", "principal"];
    const path = req.params.path;
    if (acceptedPaths.includes(path)) {
        try {
            if (req.session.user.user_type != path) {
                res.redirect("/");
                return;
            } else {
                next();
            }
        } catch (err) {
            res.redirect("/");
        }
    }
    else {
        next();
    }
});

//mount external route, now I can access to external route via ex. /admin/routename inside adminPages module .js
app.use('/admin', adminPages);
app.use('/parent', parentPages);
app.use('/auth_router', auth_router);
app.use('/teacher', teacherPages);
app.use('/officer', officerPage);
app.use("/principal", principalPage);

const options = {
    key: fs.readFileSync("./certs/localhost.key"),
    cert: fs.readFileSync("./certs/localhost.cert")
};

// Main page
app.get('/', (req, res) => {
    try {
        switch (req.session.user.user_type) {
            case "parent":
                res.redirect("/parent/parent_home");
                break;
            case "teacher":
                res.redirect("/teacher/teacher_home");
                break;
            case "admin":
                res.redirect("/admin/admin_home");
                break;
            case "officer":
                res.redirect("/officer/officer_home");
                break;
            default:
                res.redirect("/auth_router/logout");
                break;
        }
    } catch (err) {
        res.render("/pages/home.pug");
    }
});

app.get("/style", (req, res) => {
    const page = fs.readFileSync("pages/base/style.css");
    res.end(page);
});

// Page not found
app.use('/', (req, res) => {
    fs.readFile(req.path, (err, data) => {
        if (err) {
            //console.log(err);
            res.render("/pages/base/404.pug");
            return;
        }
        res.end(data);

    })
});

const httpApp = express();
httpApp.get("*", (req, res) => {
    res.redirect("https://" + req.hostname + ":" + HTTPSPORT + req.path);
});
http.createServer(httpApp).listen(HTTPPORT);
https.createServer(options, app).listen(HTTPSPORT);

console.log(`Running on http://${HOST}:${HTTPPORT}`);
console.log(`Running on https://${HOST}:${HTTPSPORT}`);