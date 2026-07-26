const express = require('express');
const router = express.Router();

const { 
  assignInspector,
  getMyTasks, 
  getInspectionHistory 
} = require('../controllers/inspector.controller');

const authMiddleware = require("../middleware/auth.middleware"); 
const roleMiddleware = require("../middleware/role.middleware"); // استدعاء حارس الصلاحيات 🛡️

router.patch('/assign', authMiddleware, roleMiddleware('Company', 'Admin'), assignInspector); 

router.get('/tasks', authMiddleware, roleMiddleware('Inspector'), getMyTasks); 

router.get('/history/:assetId', authMiddleware, getInspectionHistory); 

module.exports = router;
