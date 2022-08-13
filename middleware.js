const User = require('./models/user');

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