const User = require('../models/User');
exports.signup = (req, res) => {
    const user = new User(req.body);

    user.save().then(user => {
        res.status(201).json({ message: "created successfully", user });
    }).catch(err => {

        res.status(400).json({ err });
    });


}