const User = require('./models/user');
const Review = require('./models/review');
const { productSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('../../user/login');
    }
    next();
}

module.exports.isAdmin = async(req, res, next) => {
    const userID = req.user._id;
    const currUser = await User.findById(userID);
    if (currUser.admin) {
        next();
    } else {
        return res.sendStatus(403);
    }
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const { reviewID } = req.params;
    const review = await Review.findById(reviewID);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('back');
    }
    next();
}

module.exports.validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}