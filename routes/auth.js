const express = require('express');
const { signup, signin, signout, protect } = require('../controllers/auth');
const { userSignupValidator } = require('../validator');
const router = express.Router();

router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

router.get('/dashboard', protect, (req, res) => {
    res.send('access granted');
});


module.exports = router;