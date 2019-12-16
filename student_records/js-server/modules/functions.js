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

module.exports.dailyDate = function() {
    var today = new Date();
    var dayString = today.getDate();
    var monthString = today.getMonth() + 1;
    if (dayString < 10) 
        dayString = '0' + today.getDate();
    if (monthString < 10) 
        monthString = '0' + (today.getMonth() + 1);
    var todayString = today.getFullYear() + "-" + monthString + "-" + dayString;
    return todayString;
}