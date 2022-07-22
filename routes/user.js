const express = require('express');
const router = express.Router();
const passport = require('passport');
const { authenticate } = require('passport');
const users = require('../controllers/user');
const { isLoggedIn, passAuthenticate } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/register')
    .get(users.renderRegister)
    .post(upload.single('image'), catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '../user/login' }), users.login)

router.get('/logout', isLoggedIn, users.logout)

// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '../user/login' }), async(req, res) => {
//     req.flash('success', 'welcome back!');
//     res.redirect('../user/home');
// });

router.route('/account')
    .get(isLoggedIn, users.renderAccount)
    .post(isLoggedIn, catchAsync(users.editAccount));

router.get('/cart', isLoggedIn, catchAsync(users.cart))

router.get('/wishlist', isLoggedIn, catchAsync(users.wishlist))

// router.route('/profile')
//     .get(isLoggedIn, users.profile)
//     .post(isLoggedIn, catchAsync(users.editProfile));

module.exports = router;