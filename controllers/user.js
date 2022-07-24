const User = require('../models/user');
const flash = require('connect-flash');

module.exports.renderAccount = async(req, res) => {
    if (req.isAuthenticated()) {
        const currUserID = req.user._id
        const user = await User.findById(currUserID);
        res.render('users/account', { user })
    } else {
        res.redirect('../user/login');
    }
}

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

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
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
    const name = req.user.username
    const redirectUrl = req.session.returnTo || '/home';
    delete req.session.returnTo;
    req.flash('success', 'welcome back!');
    res.redirect(redirectUrl);
}

module.exports.logout = async(req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
    req.flash('success', "Goodbye!");
    res.redirect('/');
}