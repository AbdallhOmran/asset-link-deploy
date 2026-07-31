const waitingListModel = require("../models/waitingList.model");

const joinWaitingList = async (waitingData) => {
  // Check if company is already on the waitlist for this asset
  const existingEntry = await waitingListModel.findOne({
    assetId: waitingData.assetId,
    companyId: waitingData.companyId,
    status: "Waiting",
  });

  if (existingEntry) {
    const error = new Error("You are already on the waiting list for this asset");
    error.statusCode = 400;
    throw error;
  }

  const count = await waitingListModel.countDocuments({
    assetId: waitingData.assetId,
    status: "Waiting",
  });

  const waiting = await waitingListModel.create({
    ...waitingData,
    waitingCode: `WAIT-${Date.now()}`,
    position: count + 1,
  });

  return waiting;
};

const getWaitingListByAsset = async (assetId) => {
  const waitingList = await waitingListModel
    .find({
      assetId,
      status: "Waiting",
    })
    .populate("companyId")
    .sort({ position: 1 });

  return waitingList;
};

const removeFromWaitingList = async (id) => {
  const waitingItem = await waitingListModel.findById(id);
  if (!waitingItem) {
    throw new Error("Waiting list item not found");
  }

  const { assetId, position } = waitingItem;

  await waitingListModel.findByIdAndDelete(id);

  await waitingListModel.updateMany(
    { 
      assetId: assetId, 
      status: "Waiting", 
      position: { $gt: position } 
    },
    { 
      $inc: { position: -1 }
    }
  );

  return { message: "Removed successfully and positions updated" };
};

const { sendWaitlistNotificationEmail } = require("../utils/sendEmail.util");

const notifyFirstWaitingCompany = async (assetId) => {
  const waiting = await waitingListModel
    .findOne({
      assetId,
      status: "Waiting",
    })
    .populate("companyId")
    .populate("assetId")
    .sort({ position: 1 });

  if (!waiting) {
    return null;
  }

  waiting.status = "Notified";
  await waiting.save();

  // Send an email to the renting company
  if (waiting.companyId && waiting.assetId) {
    const toEmail = waiting.companyId.companyEmail;
    const companyName = waiting.companyId.companyName;
    const assetName = waiting.assetId.assetName;
    
    // We assume we want to send the asset owner's email to them
    // If the asset has companyId populated we could use it, but here we just get it from the asset 
    // We need to populate the owner company to get their email
    await waiting.assetId.populate("companyId");
    const ownerEmail = waiting.assetId.companyId?.companyEmail || 'support@assetlink.com';

    await sendWaitlistNotificationEmail(toEmail, companyName, assetName, ownerEmail);
  }

  return waiting;
};

module.exports = {
  joinWaitingList,
  getWaitingListByAsset,
  removeFromWaitingList,
  notifyFirstWaitingCompany,
};
