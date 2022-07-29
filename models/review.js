const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const ReviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'EcommerceUsers'
    },
}, opts);


module.exports = mongoose.model('ProductReview', ReviewSchema);