const User = require('../models/user');
const flash = require('connect-flash');
var nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
var secret;
var payload;

module.exports.cart = async(req, res) => {
    const userID = req.user._id;
    const currUser = await User.findById(userID).populate({
        path: 'cart',
        populate: {
            path: 'cart'
        }
    }).populate('cart');
    res.render('users/cart', { currUser });
}

module.exports.wishlist = async(req, res) => {
    const userID = req.user._id;
    const currUser = await User.findById(userID).populate({
        path: 'wishlist',
        populate: {
            path: 'wishlist'
        }
    }).populate('wishlist');
    res.render('users/wishlist', { currUser });
}

module.exports.renderAccount = async(req, res) => {
    const currUserID = req.user._id
    const user = await User.findById(currUserID);
    res.render('users/account', { user })
}

module.exports.editAccount = async(req, res) => {
    const { first_name, last_name, address, title, } = req.body
    const userID = req.user._id;
    const user = await User.findById(userID);
    if (first_name != '') {
        user.first_name = first_name;
    }
    if (last_name != '') {
        user.last_name = last_name;
    }
    if (address != '') {
        user.address = address;
    }
    if (title != '') {
        user.title = title;
    }
    await user.save();
    req.flash('success', 'Successfully updated account');
    res.redirect('/home');
}

module.exports.forgotPassword = async(req, res) => {
    res.render('users/forgot_password');
}

module.exports.forgotPassEmail = async(req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        res.send("This email is not registered. You may Sign up using this email.");
        return;
    }
    payload = {
        id: user._id,
        email: email
    };
    secret = uuidv4();
    var token = jwt.sign(payload, secret, { expiresIn: '1h' })
    const output = `<p>A password reset was requested on this account. Click on 
                        <a href="http://e-comwebsite.herokuapp.com/user/resetpassword/${user._id}/${token}">
                            this
                        </a>
                        link in order to reset your password. This link expires in 1 hour.
                    </p>`
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hadikaraki373@gmail.com',
            pass: 'vztvzljysxeckygd'
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"BuyForLess" hadikaraki373@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'Password reset request', // Subject line
        text: '', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}

module.exports.changePasswordPage = async(req, res) => {
    jwt.verify(req.params.token, secret, (err, authData) => {
        if (err) {
            res.send("Wrong or expired link");
        } else {
            const userID = req.params.userID;
            res.render('users/reset_password', { userID });
        }
    });
}

module.exports.changePassword = async(req, res) => {
    jwt.verify(req.params.token, secret, async(err, authData) => {
        if (err) {
            res.send("Wrong or expired link");
        } else {
            const { userID } = req.params
            const user = await User.findById(userID);
            const { newPassword } = req.body;
            user.setPassword(newPassword, function() {
                user.save();
                req.flash('success', 'Succesfuly changed password!')
                res.redirect('/user/login');
            });
            secret = uuidv4();
        }
    });
}

module.exports.renderRegister = (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('users/register');
    } else {
        req.flash('error', 'Already logged in');
        res.redirect('back');
    }
}

module.exports.register = async(req, res) => {
    if (!req.isAuthenticated()) {
        try {
            const { email, username, last_name, first_name, password, title, phone_number, address } = req.body;
            const user = new User({ email, username, last_name, first_name, title, phone_number, address });
            user.admin = false;
            const registeredUser = await User.register(user, password);
            await user.save()
            req.login(registeredUser, err => {
                if (err) return next(err);
                req.flash('success', 'Welcome!');
                res.redirect(`/home`);
            })
        } catch (e) {
            req.flash('error', e.message);
            res.redirect('/user/register');
        }
    } else {
        res.redirect(`/home`);
    }
}

module.exports.renderLogin = async(req, res) => {
    if (!req.isAuthenticated()) {
        res.render('users/login');
    } else {
        res.redirect(`/home`);
    }
}

module.exports.login = async(req, res) => {
    if (!req.isAuthenticated()) {
        const name = req.user.username
        const currUser = req.user;
        const redirectUrl = req.session.returnTo || '/home';
        req.flash('success', 'welcome back!');
        res.redirect(redirectUrl);
    } else {
        req.flash('error', 'Already logged in');
        res.redirect('back');
    }
}

module.exports.logout = async(req, res, next) => {
    //delete req.session.returnTo;
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
    req.flash('success', "Goodbye!");
    res.redirect('/');
}

//sbiwphzqazzjxtzc