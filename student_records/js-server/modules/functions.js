'use strinct';

const mysql = require('mysql');

const passwd = "pwd";

//functions
module.exports.DBconnect = function () {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: passwd,
        database: "students",
        insecureAuth: true
    });
}