const User = require('../models/user');
const Product = require('../models/product');
const { cloudinary } = require("../cloudinary");
var mongoose = require('mongoose');

const castErrorDB = err => {
    if (err.name === 'CastError')
        return new Error(`Invalid ${err.path}: ${err.value}`);
    return err;
};

module.exports.showProduct = async(req, res) => {
    try {
        const { id } = req.params;
        var product = await Product.findById(id).populate('reviews')
        if (!product) {
            req.flash('error', 'Cannot find that product!');
            return res.redirect('back');
        }
        populatedProduct = await product.populate('reviews.author');
        var reviewSum = 0;
        for (let review of populatedProduct.reviews) {
            reviewSum += review.rating;
        }
        var averageRating = reviewSum / product.reviews.length
        averageRating = Math.ceil(averageRating);
        var addedToCart = false;
        var addedToWishlist = false;
        if (req.isAuthenticated()) {
            const currUserID = req.user._id
            var reviewed = false;
            var reviewIndex = -1;
            const currUser = await User.findById(currUserID)
            for (let review of product.reviews) {
                reviewIndex += 1;
                if (review.author._id.equals(currUserID)) {
                    reviewed = true;
                    break;
                }
            }
            const cartIndex = currUser.cart.indexOf(populatedProduct._id);
            const wishlistIndex = currUser.wishlist.indexOf(populatedProduct._id);
            if (cartIndex > -1) {
                addedToCart = true;
            }
            if (wishlistIndex > -1) {
                addedToWishlist = true;
            }
        }
        // product: reviews => array of "review" ids
        // populatedProduct: reviews => array of populated "review" documents

        // 1) To get review id of user: product.reviews.indexOf(userID)
        // 2) To get the review document: populatedProduct.reviews[index]
        var userReview = false;
        if (reviewIndex > -1) {
            userReview = populatedProduct.reviews[reviewIndex]
        }
        populatedProduct.in_stock = true;
        populatedProduct.nb_in_stock = 3;
        await populatedProduct.save();
        res.render('products/show', { populatedProduct, addedToCart, addedToWishlist, averageRating, reviewed, userReview });
    } catch (e) {
        console.log(castErrorDB(e));
        req.flash('error', 'Cannot find that product!');
        res.redirect('back')
    }
}

module.exports.category = async(req, res) => {
    const { category } = req.params;
    const products = await Product.find({ category: category });
    res.render('products/category', { products, category });
}

module.exports.addToCart = async(req, res) => {
    // AJAX
    if (req.isAuthenticated()) {
        const { id } = req.body;
        const userID = req.user._id;
        var productId = mongoose.Types.ObjectId(id);
        const currUser = await User.findById(userID);
        currUser.cart.push(productId);
        await currUser.save();
    } else {
        res.redirect('/user/login');
    }
}

module.exports.removeFromCart = async(req, res) => {
    // AJAX
    const { id } = req.body;
    const userID = req.user._id;
    var productId = mongoose.Types.ObjectId(id);
    const product = await Product.findById(productId);
    await User.findByIdAndUpdate(userID, { $pull: { cart: productId } });
}

module.exports.deleteFromCart = async(req, res) => {
    const { id } = req.params;
    const userID = req.user._id;
    await User.findByIdAndUpdate(userID, { $pull: { cart: id } });
    res.redirect('back')
}

module.exports.addToWishlist = async(req, res) => {
    // AJAX
    console.log('add to wish')
    const { id } = req.body;
    const userID = req.user._id;
    var productId = mongoose.Types.ObjectId(id);
    const currUser = await User.findById(userID);
    currUser.wishlist.push(productId);
    await currUser.save();
}

module.exports.removeFromWishlist = async(req, res) => {
    // AJAX
    console.log('remove from wish')
    const { id } = req.body;
    const userID = req.user._id;
    var productId = mongoose.Types.ObjectId(id);
    const product = await Product.findById(productId);
    await User.findByIdAndUpdate(userID, { $pull: { wishlist: productId } });
}

module.exports.deleteFromWishlist = async(req, res) => {
    const { id } = req.params;
    const userID = req.user._id;
    await User.findByIdAndUpdate(userID, { $pull: { wishlist: id } });
    res.redirect('back')
}

module.exports.renderNewProduct = async(req, res) => {
    res.render('products/add');
}

module.exports.addProduct = async(req, res) => {
    const product = new Product(req.body.product);
    product.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await product.save()
    req.flash('success', 'Successfully added product');
    res.redirect(`/product/${product._id}`)
}

module.exports.renderEditProduct = async(req, res) => {
    const { productID } = req.params;
    const product = await Product.findById(productID)
    res.render('products/edit', { product });
}

module.exports.editProduct = async(req, res) => {
    const { productID } = req.params;
    const product = await Product.findByIdAndUpdate(productID, {...req.body.product });
    // const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // site.images.push(...imgs);
    await product.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated product');
    res.redirect(`/product/${productID}`)
}

module.exports.deleteProduct = async(req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success', 'Successfully removed product')
    res.redirect('/home');
    // req.flash('error', 'Product not found!')
    // res.redirect('/user/account');
}