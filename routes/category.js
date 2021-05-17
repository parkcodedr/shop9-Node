const express = require('express');
const { protect, isAuth, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');
const router = express.Router();


const { create, getCategoryById, read, update, remove, list } = require('../controllers/category');

router.post('/category/create/:userId', protect, isAuth, isAdmin, create);
router.get('/category/:categoryId', read);
router.put('/category/:categoryId/:userId', protect, isAuth, isAdmin, update);

router.delete('/category/:categoryId/:userId', protect, isAuth, isAdmin, remove);
router.get('/categories', list);


router.param('categoryId', getCategoryById);
router.param('userId', getUserById);


module.exports = router;