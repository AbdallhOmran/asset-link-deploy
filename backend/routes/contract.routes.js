const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createContract,
  getContracts,
  getContract,
  approveContract,
  rejectContract,
} = require("../controllers/contract.controller");

router.post("/", createContract);
router.get("/", getContracts);
router.get("/:id", getContract);

router.patch("/:id/approve", authMiddleware, approveContract);
router.patch("/:id/reject", authMiddleware, rejectContract);

module.exports = router;
