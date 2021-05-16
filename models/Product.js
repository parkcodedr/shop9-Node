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
        ref: 'Category',
        required: true,
        maxLength: 32,
    },
    quantity: {
        type: Number,
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
)

module.exports = mongoose.model('Products', productSchema);