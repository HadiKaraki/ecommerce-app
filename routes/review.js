const comments = require('../controllers/review');
const express = require('express');
const { isLoggedIn } = require('../middleware');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

router.post('/new/:productID', isLoggedIn, catchAsync(comments.newReview))

router.delete('/delete/:reviewID', isLoggedIn, catchAsync(comments.deleteReview))

module.exports = router;