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
        const product = await Product.findById(id);
        var addedToCart = false;
        var addedToWishlist = false;
        if (req.isAuthenticated()) {
            const userID = req.user._id;
            const currUser = await User.findById(userID)
            if (!product) {
                req.flash('error', 'Cannot find that product!');
                return res.redirect('back');
            }
            const cartIndex = currUser.cart.indexOf(product._id);
            const wishlistIndex = currUser.wishlist.indexOf(product._id);
            if (cartIndex > -1) {
                addedToCart = true;
            }
            if (wishlistIndex > -1) {
                addedToWishlist = true;
            }
        }
        res.render('products/show', { product, addedToCart, addedToWishlist });
    } catch (e) {
        console.log(castErrorDB(e));
        req.flash('error', 'Cannot find that product!');
        res.redirect('back')
    }
}

module.exports.addToCart = async(req, res) => {
    // AJAX
    console.log('add to cart')
    const { id } = req.body;
    const userID = req.user._id;
    var productId = mongoose.Types.ObjectId(id);
    const currUser = await User.findById(userID);
    currUser.cart.push(productId);
    await currUser.save();
}

module.exports.removeFromCart = async(req, res) => {
    console.log('remove from cart')
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
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('product/edit', { product });
}

module.exports.editProduct = async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, {...req.body.site });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    site.images.push(...imgs);
    await product.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated product');
    res.redirect(`/sites/show/${site._id}`)
}

module.exports.deleteProduct = async(req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success', 'Successfully removed product')
    res.redirect('/home');
    // req.flash('error', 'Product not found!')
    // res.redirect('/user/account');
}