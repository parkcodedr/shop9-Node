const User = require('../models/User');


exports.getUserById = (req, res, next, userId) => {
    User.findById(userId).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        req.profile = user;
        next();
    });

}