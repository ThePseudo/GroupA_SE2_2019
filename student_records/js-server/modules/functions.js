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

module.exports.checkItalianSSN = function(str){
    let reg = "(^([A-Za-z]{6}[0-9lmnpqrstuvLMNPQRSTUV]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9lmnpqrstuvLMNPQRSTUV]{2}[A-Za-z]{1}[0-9lmnpqrstuvLMNPQRSTUV]{3}[A-Za-z]{1})$|^([0-9]{11})$)";
    var patt = new RegExp(reg);
    return patt.test(str); 
}

/* module.exports.checkEmailFormat = function(str){
    console.log(str);
    let reg = "/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/"; 
    var patt = new RegExp(reg);
    return patt.test(str); 
} */