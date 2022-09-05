const express = require('express');
const router = express.Router();

const { me, updatePassword } = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/me', auth, me);
router.put('/update', auth, updatePassword);

module.exports = router;