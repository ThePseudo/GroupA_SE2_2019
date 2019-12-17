'use strict';

// Use at least Nodemailer v4.1.0
const nodemailer = require('nodemailer');

module.exports.mail_handler = function (first_name, last_name, username, email, tmp_pwd, user_type) {
  /*
  credenziali:  

  user:   francoisRed63@gmail.com
  pwd:    _t&st_Pwd
  */
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'francoisRed63@gmail.com',
      pass: '_t&st_Pwd'
    }
  });

  const mailOptions = {
    from: 'sysAdmin@gmail.com', // sender address
    to: email, // list of receivers
    subject: 'Credentialial new user', // Subject line
    html: `<p>Dear ${first_name} ${last_name},</p>
        <p>Your provvisorial credentials are:</p><p></p>
        <p>username: ${username}</p>
        <p>password: ${tmp_pwd}</p>
        <a href="https://localhost:8080/auth_router/login_${user_type}"><button>Go to Login Page</button>`
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err)
      console.log(err)
    else
      console.log(info);
  });
}