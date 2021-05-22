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
exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}
exports.update = (req, res) => {
    User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true })
        .then(user => {
            user.hashed_password = undefined;
            user.salt = undefined;
            return res.status(200).json(user);
        }).catch(err => {
            res.status(400).json({ error: "error Occurred" });
        })
}