const User = require('../models/user');
const Product = require('../models/product');
const Review = require('../models/review');
var mongoose = require('mongoose');

module.exports.newReview = async(req, res) => {
    const { productID } = req.params
    const { text, rating } = req.body;
    const review = new Review();
    const product = await Product.findById(productID);
    review.body = text
    review.rating = rating;
    review.author = req.user._id
    await review.save()
    product.reviews.push(review)
    await product.save();
    req.flash('success', 'Successfully made a new review');
    res.redirect('back')
}

module.exports.deleteReview = async(req, res) => {
    const userID = req.user._id;
    const { reviewID } = req.params;
    // find the user that owns the post and remove that post from it (posts array)
    //const post = Post.findOne({ comments: commentID })
    await Product.findOneAndUpdate(reviewID, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Successfully deleted review')
    res.redirect('back');
}