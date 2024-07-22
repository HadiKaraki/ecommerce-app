const Product = require('../models/product');
const Review = require('../models/review');

module.exports.newReview = async(req, res) => {
    const { productID } = req.params
    const product = await Product.findById(productID);
    const review = new Review(req.body.review);
    review.author = req.user._id
    await review.save()
    product.reviews.push(review)
    await product.save();
    req.flash('success', 'Review added');
    res.redirect(`../../product/${productID}`);
}

module.exports.deleteReview = async(req, res) => {
    const { reviewID } = req.params;
    const { productID } = req.params;
    await Product.findOneAndUpdate(reviewID, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Review deleted')
    res.redirect(`../../product/${productID}`);
}