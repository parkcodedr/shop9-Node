const express = require('express');
const { protect, isAuth, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');
const router = express.Router();



const { create, getProductById, read, remove, update } = require('../controllers/product');

router.post('/product/create/:userId', protect, isAuth, isAdmin, create);
router.get('/product/:productId', read);
router.delete('/product/:productId/:userId', protect, isAuth, isAdmin, remove);
router.put('/product/:productId/:userId', protect, isAuth, isAdmin, update);


router.param('userId', getUserById);
router.param('productId', getProductById);


module.exports = router;