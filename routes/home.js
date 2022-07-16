const express = require('express');
const router = express.Router();
const passport = require('passport');
const { authenticate } = require('passport');
const home = require('../controllers/home');
const { isLoggedIn, passAuthenticate } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/', home.homePage)

module.exports = router;