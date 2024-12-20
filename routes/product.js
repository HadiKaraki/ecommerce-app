const products = require('../controllers/product');
const express = require('express');
const { isLoggedIn, validateProduct, isAdmin } = require('../middleware');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const catchAsync = require('../utils/catchAsync');

router.route('/new')
    .get(catchAsync(products.renderNewProduct))
    .post(upload.array('image'), isLoggedIn, isAdmin, validateProduct, catchAsync(products.addProduct))

router.route('/edit/:productID')
    .get(isLoggedIn, isAdmin, catchAsync(products.renderEditProduct))
    .put(upload.array('image'), isLoggedIn, isAdmin, validateProduct, catchAsync(products.editProduct))

router.post('/addToCart/:productID', isLoggedIn, catchAsync(products.addToCart))

router.post('/removeFromCart', isLoggedIn, catchAsync(products.removeFromCart))

router.post('/removeFromCartShow/:productID', isLoggedIn, catchAsync(products.removeFromCartShow))

router.post('/addToWishlist/:productID', isLoggedIn, catchAsync(products.addToWishlist))

router.post('/removeFromWishlist/:productID', isLoggedIn, catchAsync(products.removeFromWishlist))

router.post('/removeFromWishlistShow/:productID', isLoggedIn, catchAsync(products.removeFromWishlistShow))

router.get('/category/:category', catchAsync(products.category))

router.get('/filter_category', catchAsync(products.cat))

router.route('/:id')
    .get(products.showProduct)
    .delete(isLoggedIn, isAdmin, catchAsync(products.deleteProduct));

module.exports = router;