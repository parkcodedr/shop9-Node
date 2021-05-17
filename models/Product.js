const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 32,
    },
    description: {
        type: String,
        required: true,
        maxLength: 2000,
    },
    price: {
        type: Number,
        required: true,
        maxLength: 32,
    },
    category: {
        type: ObjectId,
        ref: 'Categories',
        required: true,
        maxLength: 32,
    },
    quantity: {
        type: Number,
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    shipping: {
        type: Boolean,
        required: false,
    },


}
    , { timestamps: true }
)

module.exports = mongoose.model('Products', productSchema);