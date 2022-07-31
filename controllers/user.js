const User = require('../models/user');
const flash = require('connect-flash');
var nodemailer = require('nodemailer');

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

module.exports.forgotPassInstruc = async(req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    const output = `<p>Click on 
                        <a href="http://localhost:3000/user/resetpassword/${user._id}">
                            this
                        </a>
                        link in order to reset your password.
                    </p>`
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'yeah.com75@gmail.com',
            pass: 'sbiwphzqazzjxtzc'
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"BuyForLess" yeah.com75@gmail.com', // sender address
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

        res.render('users/forgot_pass_instruc');
    });
}

module.exports.resetPassword = async(req, res) => {
    const { userID } = req.params;
    if (userID.length !== 24) {
        req.flash('error', 'Expired or wrong link')
        res.redirect('/user/login');
        return;
    }
    res.render('users/reset_password', { userID });
}

module.exports.changePassword = async(req, res) => {
    const { userID } = req.params
    const user = await User.findById(userID);
    const { newPassword } = req.body;
    if (user) {
        user.setPassword(newPassword, function() {
            user.save();
            req.flash('success', 'Succesfuly changed password!')
            res.redirect('/user/login');
        });
    } else {
        req.flash('error', 'User not found')
        res.redirect('/user/login');
    }
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