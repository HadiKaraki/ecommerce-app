const reviews = require('../controllers/review');
const express = require('express');
const { isLoggedIn, isReviewAuthor } = require('../middleware');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

router.post('/new/:productID', isLoggedIn, catchAsync(reviews.newReview))

router.delete('/delete/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;