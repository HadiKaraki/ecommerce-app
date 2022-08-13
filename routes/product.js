const products = require('../controllers/product');
const express = require('express');
const { isLoggedIn } = require('../middleware');
const { isAdmin } = require('../middleware');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const catchAsync = require('../utils/catchAsync');

router.route('/new')
    .get(isLoggedIn, isAdmin, catchAsync(products.renderNewProduct))
    .post(upload.array('image'), isLoggedIn, isAdmin, catchAsync(products.addProduct))

router.route('/edit/:productID')
    .get(isLoggedIn, isAdmin, catchAsync(products.renderEditProduct))
    .post(upload.array('image'), isLoggedIn, isAdmin, catchAsync(products.editProduct))

router.post('/delete/:productID', isLoggedIn, isAdmin, catchAsync(products.deleteProduct))

router.post('/addToCart/:productID', isLoggedIn, catchAsync(products.addToCart))

router.post('/removeFromCart/:productID', isLoggedIn, catchAsync(products.removeFromCart))

router.post('/addToWishlist/:productID', isLoggedIn, catchAsync(products.addToWishlist))

router.post('/removeFromWishlist/:productID', isLoggedIn, catchAsync(products.removeFromWishlist))

router.get('/category/:category', catchAsync(products.category))

router.get('/filter_category', catchAsync(products.cat))

router.route('/:id')
    .get(products.showProduct)
    .delete(isLoggedIn, isAdmin, catchAsync(products.deleteProduct));

module.exports = router;