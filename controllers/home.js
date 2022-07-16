const User = require('../models/user');
const Product = require('../models/product');
const { cloudinary } = require("../cloudinary");
var mongoose = require('mongoose');

module.exports.homePage = async(req, res) => {
    const tvs = await Product.find({ category: 'TV' });
    const mobile_phones = await Product.find({ category: 'MOBILE' });
    const appliances = await Product.find({ category: 'APPLIANCE' });
    res.render('home', { tvs, mobile_phones, appliances });
}