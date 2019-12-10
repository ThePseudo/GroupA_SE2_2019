'use strinct';

const mysql = require('mysql');

//functions
module.exports.DBconnect = function () {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });
}