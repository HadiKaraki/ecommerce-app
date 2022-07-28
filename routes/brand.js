const brands = require('../controllers/brand');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

router.get('/brand/:brand', catchAsync(brands.brandsPage))

module.exports = router;