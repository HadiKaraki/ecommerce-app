const reviews = require('../controllers/review');
const express = require('express');
const { isLoggedIn } = require('../middleware');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

router.post('/new/:productID', isLoggedIn, catchAsync(reviews.newReview))

router.delete('/delete/:reviewID', isLoggedIn, catchAsync(reviews.deleteReview))

module.exports = router;