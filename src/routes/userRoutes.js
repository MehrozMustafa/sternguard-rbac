const express = require('express');
const router = express.Router();
const { login, getMehroz } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const rbacMiddleware = require('../middlewares/rbacMiddleware');

router.post('/login', login);

// Protect /get with auth + RBAC middleware (only admin)
router.get('/get', authMiddleware, rbacMiddleware('admin'), getMehroz);

module.exports = router;
