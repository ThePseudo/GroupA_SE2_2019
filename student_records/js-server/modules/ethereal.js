//'use strict';

// Use at least Nodemailer v4.1.0
const nodemailer = require('nodemailer');

// Generate SMTP service account from ethereal.email

module.exports.mail_handler = function (name, surname, SSN, email, password, user_type) {
    nodemailer.createTestAccount((err, account) => {
        if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
        }

        console.log('Credentials obtained, sending message...');

        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });

        // Message object
        let message = {
            from: '<Mr.Principal@school.edu>',
            to: email,
            subject: 'Nodemailer is unicode friendly ✔',
            html: '<p>Click the button to change password</p> <a href="https://localhost:8080/auth_router/change_pwd"><button>change</button>'
        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return process.exit(1);
            }

            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });
}

module.exports.mail_handler;