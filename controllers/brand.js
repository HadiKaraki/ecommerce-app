const Product = require('../models/product');
const { cloudinary } = require("../cloudinary");
var mongoose = require('mongoose');

module.exports.brandsPage = async(req, res) => {
    const { brand } = req.params
    const brandProducts = await Product.find({ category: brand });
    res.render('brand_products', { brandProducts });
}