const express = require("express")
const router = express.Router()
const inspectionController = require("../controllers/inspection.controller")
router.post("/create", inspectionController.createInspection)
module.exports = router