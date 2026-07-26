const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { createPenalty } = require("../controllers/penalty.controller");

// POST /api/penalty
router.post("/", authMiddleware, createPenalty);

module.exports = router;
