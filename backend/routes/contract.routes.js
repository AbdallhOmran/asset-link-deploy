const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createContract,
  getContracts,
  getContract,
  approveContract,
  rejectContract,
  generateContractPDF,
  downloadContractPDF,
  viewContractPDF,
} = require("../controllers/contract.controller");


router.post("/", createContract);
router.get("/", getContracts);
router.get("/:id", getContract);

router.patch("/:id/approve", authMiddleware, approveContract);
router.patch("/:id/reject", authMiddleware, rejectContract);


router.get("/:id/pdf", generateContractPDF);
router.get("/:id/download", downloadContractPDF);
router.get("/:id/view", viewContractPDF);

module.exports = router;
