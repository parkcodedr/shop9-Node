const express = require('express');
const { protect, isAuth, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');
const router = express.Router();



const { create, getCategoryById, read } = require('../controllers/category');

router.post('/category/create/:userId', protect, isAuth, isAdmin, create);

router.get('/category/:categoryid', protect, isAuth, isAdmin, read);

router.param('categoryId', getCategoryById);
router.param('userId', getUserById);


module.exports = router;