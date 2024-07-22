const express = require('express');
const router = express.Router();
const passport = require('passport');
const { authenticate } = require('passport');
const users = require('../controllers/user');
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/creditcard')
    .get(isLoggedIn, users.renderCreditCard)
    .post(isLoggedIn, users.creditCard)

router.route('/checkout')
    .get(isLoggedIn, users.renderCheckout)
    .post(isLoggedIn, users.checkout)

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '../user/login' }), users.login)

router.get('/logout', isLoggedIn, users.logout)

router.route('/account')
    .get(users.renderAccount)
    .post(isLoggedIn, catchAsync(users.editAccount));

router.route('/forgotpassword')
    .get(users.forgotPassword)
    .post(users.forgotPassEmail)

router.get('/resetpassword/:userID/:token', users.changePasswordPage)

router.post('/resetpassword/:userID/:token', users.changePassword)

router.get('/cart', isLoggedIn, catchAsync(users.cart))

router.get('/wishlist', isLoggedIn, catchAsync(users.wishlist))

module.exports = router;