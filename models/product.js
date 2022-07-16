const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availability: Boolean,
    description: String,
    category: {
        type: String,
        required: true
    },
    brand: ImageSchema,
    code: {
        type: String,
        required: true
    },
    images: [ImageSchema],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'EcommerceUsers'
    }]
}, opts);

// PostSchema.post('findOneAndDelete', async function(doc) {
//     if (doc) {
//         await Post.deleteMany({
//             _id: {
//                 $in: doc.posts
//             }
//         })
//     }
// })

ProductSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.posts
            }
        })
    }
})

module.exports = mongoose.model('Product', ProductSchema);