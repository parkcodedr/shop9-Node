const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 32,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    hashed_password: {
        type: String,
        required: true,
    },
    salt: String,

    about: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        default: 0,
    },
    history: {
        type: Array,
        default: []
    }
})
userSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = uuidv4();
        this.hashed_password = this.encryptPassword(password);

    }).get(function () {
        return this._password;
    });

userSchema.methods = {
    encryptPassword: function encryptPassword(password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        } catch (err) {
            return '';
        }
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;