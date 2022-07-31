var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yeah.com75@gmail.com',
        pass: 'karaki789'
    }
});

var mailOptions = {
    from: 'yeah.com75@gmail.com',
    to: userEmail,
    subject: 'Reset password request',
    text: `A password reset request was requested from this account. Go to this link in order to reset your account. /user/resetpassword/${userID}`
};

function sendEmail() {
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = nodemailer;