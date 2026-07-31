const express = require("express");
const router = express.Router();

const {
  joinWaitingList,
  getWaitingListByAsset,
  removeFromWaitingList,
  notifyFirstWaitingCompany,
} = require("../controllers/waitingList.controller");

router.post("/", joinWaitingList);

router.get("/:assetId", getWaitingListByAsset);

router.delete("/:id", removeFromWaitingList);

router.post("/:assetId/notify", notifyFirstWaitingCompany);

module.exports = router;