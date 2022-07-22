const products = require('../controllers/product');
const express = require('express');
const { isLoggedIn } = require('../middleware');
const { isAdmin } = require('../middleware');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const catchAsync = require('../utils/catchAsync');

router.get('/new', isLoggedIn, isAdmin, catchAsync(products.renderNewProduct))

router.post('/add', upload.array('image'), isLoggedIn, isAdmin, catchAsync(products.addProduct))

router.get('/category/:category', catchAsync(products.category))

router.post('/addToCart', isLoggedIn, catchAsync(products.addToCart))

router.post('/removeFromCart', isLoggedIn, catchAsync(products.removeFromCart))

router.post('/deleteFromCart/:id', isLoggedIn, catchAsync(products.deleteFromCart))

router.post('/deleteFromWishlist/:id', isLoggedIn, catchAsync(products.deleteFromCart))

router.post('/addToWishlist', isLoggedIn, catchAsync(products.addToWishlist))

router.post('/removeFromWishlist', isLoggedIn, catchAsync(products.removeFromWishlist))

router.route('/:id')
    .get(products.showProduct)
    .delete(isLoggedIn, isAdmin, catchAsync(products.deleteProduct));

module.exports = router;