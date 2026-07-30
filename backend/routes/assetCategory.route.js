const express = require('express');
const router = express.Router();

const { addCategory, viewCategories } = require('../controllers/assetCategory.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/addCategory', authMiddleware, addCategory);
router.get('/viewCategories', authMiddleware, viewCategories);

module.exports = router;