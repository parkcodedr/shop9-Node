const express = require('express');
const router = express.Router();

const { protect, isAdmin, isAuth } = require('../controllers/auth');
const { getUserById, update, read } = require('../controllers/user');


router.get("/user/:userId", protect, isAuth, read);
router.put("/user/:userId", protect, isAuth, update);


router.param('userId', getUserById);


module.exports = router;