const express = require('express');
const router = express.Router();

const { protect, isAdmin, isAuth } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');


router.get("/user/:userId", protect, (req, res) => {
    console.log(req.params);
    res.json({
        user: req.profile
    })
})

router.param('userId', getUserById);


module.exports = router;