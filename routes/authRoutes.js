const express = require('express');
const router = express.Router();
const { signup, signin, updatePassword} = require('../controllers/authController');
const auth = require('../middlewares/auth');

router.post('/signup', signup);
router.post('/signin', signin);
router.put('/update', auth, updatePassword);

module.exports = router;