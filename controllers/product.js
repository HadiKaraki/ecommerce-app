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
        var product = await Product.findById(id).populate('reviews');
        if (!product) {
            req.flash('error', 'Cannot find that product!');
            return res.redirect('back');
        }
        populatedProduct = await product.populate('reviews.author');
        // AVERAGE RATING
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
            const currUser = await User.findById(currUserID);
            // CHECK IF USER HAS A REVIEW
            var reviewed = false;
            var reviewIndex = -1;
            for (let review of product.reviews) {
                reviewIndex += 1;
                if (review.author._id.equals(currUserID)) {
                    reviewed = true;
                    break;
                }
            }
            // CHECK IF PRODUCT IS IN THE USER'S CART/WISHLIST
            const cartIndex = currUser.cart.indexOf(populatedProduct._id);
            const wishlistIndex = currUser.wishlist.indexOf(populatedProduct._id);
            if (cartIndex > -1) {
                addedToCart = true;
            }
            if (wishlistIndex > -1) {
                addedToWishlist = true;
            }
        }
        // GET USER'S REVIEW TO PUT UP FRONT:
        // product: reviews => array of "review" ids
        // populatedProduct: reviews => array of populated "review" documents

        // 1) To get review id of user: product.reviews.indexOf(userID)
        // 2) To get the review document: populatedProduct.reviews[index]
        var userReview = false;
        if (reviewIndex > -1) {
            userReview = populatedProduct.reviews[reviewIndex]
        }
        res.render('products/show', { populatedProduct, addedToCart, addedToWishlist, averageRating, reviewed, userReview });
    } catch (e) {
        console.log(castErrorDB(e));
        //req.flash('error', 'Cannot find that product!');
        res.redirect('back')
    }
}

module.exports.category = async(req, res) => {
    const { category } = req.params;
    const products = await Product.find({ category: category });
    res.render('products/category', { products, category });
}

module.exports.addToCart = async(req, res) => {
    const { productID } = req.params;
    const userID = req.user._id;
    const currUser = await User.findById(userID);
    currUser.cart.push(productID);
    await currUser.save();
    req.flash('success', 'Added to cart');
    res.redirect(`../../product/${productID}`);
}

module.exports.removeFromCart = async(req, res) => {
    const { productID } = req.params;
    const userID = req.user._id;
    if (req.body.removeProducts) {
        await User.findByIdAndUpdate(userID, { $pull: { cart: { $in: req.body.removeProducts } } });
    }
    req.flash('success', 'Removed from cart');
    res.redirect('../../user/cart')
}

module.exports.removeFromCartShow = async(req, res) => {
    const { productID } = req.params;
    const userID = req.user._id;
    await User.findByIdAndUpdate(userID, { $pull: { cart: productID } });
    req.flash('success', 'Removed from cart');
    res.redirect(`../../product/${productID}`);
}

module.exports.addToWishlist = async(req, res) => {
    const { productID } = req.params;
    const userID = req.user._id;
    const currUser = await User.findById(userID);
    currUser.wishlist.push(productID);
    await currUser.save();
    req.flash('success', 'Added to wishlist');
    res.redirect(`../../product/${productID}`);
}

module.exports.removeFromWishlist = async(req, res) => {
    const { productID } = req.params;
    const userID = req.user._id;
    await User.findByIdAndUpdate(userID, { $pull: { wishlist: productID } });
    req.flash('success', 'Removed from wishlist');
    res.redirect('../../user/wishlist')
}

module.exports.removeFromWishlistShow = async(req, res) => {
    const { productID } = req.params;
    const userID = req.user._id;
    await User.findByIdAndUpdate(userID, { $pull: { wishlist: productID } });
    req.flash('success', 'Removed from wishlist');
    res.redirect(`../../product/${productID}`);
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
    if (req.files) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        product.images.push(...imgs);
    }
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await product.save()
    req.flash('success', 'Successfully updated product');
    res.redirect(`/product/${productID}`)
}

module.exports.deleteProduct = async(req, res) => {
    const { id } = req.params;
    const result = await Product.findByIdAndDelete(id);
    console.log(result)
    req.flash('success', 'Successfully removed product')
    res.redirect('/home');
    if (!result) {
        req.flash('error', 'Product not found!')
        res.redirect('back');
    }
}