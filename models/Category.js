const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 32,
    },

}
)

module.exports = mongoose.model('Categories', categorySchema);