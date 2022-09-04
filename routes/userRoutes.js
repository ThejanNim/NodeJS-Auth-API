const express = require('express');
const router = express.Router();

const { me } = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/me', auth, me);

module.exports = router;