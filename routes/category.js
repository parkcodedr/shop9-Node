const express = require('express');
const { protect, isAuth, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');
const router = express.Router();



const { create } = require('../controllers/category');

router.post('/category/create/:userId', protect, isAuth, create);


router.param('userId', getUserById);


module.exports = router;