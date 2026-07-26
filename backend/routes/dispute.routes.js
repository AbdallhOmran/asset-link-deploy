const express = require("express");
const router = express.Router();

const {
  openDispute,
  resolveDispute,
} = require("../controllers/dispute.controller");

router.post("/", openDispute);
router.patch("/:id/resolve", resolveDispute);

module.exports = router;
