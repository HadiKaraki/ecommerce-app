const Product = require('../models/product');
var mongoose = require('mongoose');

module.exports.brandsPage = async(req, res) => {
    const { brand } = req.params
    const brandProducts = await Product.find({ brand: brand });
    console.log(brandProducts)
    res.render('brand', { brandProducts });
}