const User = require('../models/User');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

function generateAccessToken(id) {
    return jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: '1800s' });
}
exports.signup = (req, res) => {
    const user = new User(req.body);

    user.save().then(user => {
        user.salt = undefined;
        user.hashed_password = undefined;
        res.status(201).json({ message: "created successfully", user });
    }).catch(err => {
        res.status(400).json({ err: errorHandler(err) });
    });


}
exports.signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ err: "User with that email not Found" });
    }
    if (!user.authenticate(password)) {
        return res.status(401).json({ err: "Wrong Email or Password" });
    }

    const token = generateAccessToken(user._id);

    res.cookie("t", token, { expire: new Date() + 9999 });
    const { _id, name, userEmail, role } = user;
    return res.status(200).json({ token, user: { _id, name, userEmail, role } });

}
exports.signout = (req, res) => {
    console.log(req.cookie);
    res.clearCookie("t");
    res.json({ message: "Signout successfully" });
}

// exports.protect = expressJWT({
//     secret: process.env.JWT_SECRET,
//     algorithms: ["HS256"],
//     userProperty: "auth",
// })
exports.protect = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.status(403).json({ error: "Invalid Token" })
        req.user = user
        next()
    })

}

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.user && req.profile._id == req.user._id;
    console.log(req.profile);
    if (!user) {
        return res.status(403).json({ error: "Access denied" });
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({ error: "Admin Resource! Access denied" });
    }
    next();
}


