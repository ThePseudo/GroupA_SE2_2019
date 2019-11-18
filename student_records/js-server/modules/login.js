var express = require('express');
var router = express.Router();

router.post('/login_teacher', (req, res) => {
    var ssn = req.body.SSN;
    var pwd = req.body.passwd;
    console.log(ssn + "\n" + pwd);
});

module.exports = router;