const negotiationModel = require("../models/nagotiation.model");
const versionModel = require("../models/version.model");
const bookingModel = require("../models/booking.model");
const companyModel = require("../models/company.model");
const contractService = require("./contract.service");

const generateNegotiationCode = async () => {
  const lastNegotiation = await negotiationModel
    .findOne()
    .sort({ createdAt: -1 });
  if (!lastNegotiation) return "NG-00001";

  const lastCode = lastNegotiation.negotiationCode;
  const lastNumber = parseInt(lastCode.split("-")[1]);
  const newNumber = lastNumber + 1;
  const newCode = `NG-${newNumber.toString().padStart(4, "0")}`;
  return newCode;
};

const createVersion = async ({
  negotiationId,
  versionNumber,
  rentPrice,
  securityDeposit,
  rentalDuration,
  durationUnit,
  counterBy,
  notes,
}) => {
  if (rentPrice == null) throw new Error("Rent price is required");
  if (securityDeposit == null) throw new Error("Security Deposit is requierd");
  if (rentalDuration == null || rentalDuration <= 0)
    throw new Error("Rental Duration is required");
  if (!durationUnit) throw new Error("Duration Unit is required");

  const version = new versionModel({
    negotiationId,
    versionNumber,
    rentPrice,
    securityDeposit,
    rentalDuration,
    durationUnit,
    counterBy,
    notes,
  });

  await version.save();
  return version;
};

const createNegotiation = async (negotiationData, versionData) => {
  const { ownerCompany, renterCompany, bookingId } = negotiationData;

  if (!ownerCompany) throw new Error("Owner Company is required");
  if (!renterCompany) throw new Error("Renter Company is required");
  if (!bookingId) throw new Error("Booking ID is required");

  const checkOwnerCompany = await companyModel.findById(ownerCompany);
  const checkRenterCompany = await companyModel.findById(renterCompany);
  if (!checkOwnerCompany || !checkRenterCompany)
    throw new Error("This Company not found");

  const checkBookingId = await bookingModel.findById(bookingId);
  if (!checkBookingId) throw new Error("This Booking is not found");

  const existingNegotiation = await negotiationModel.findOne({ bookingId });
  if (existingNegotiation)
    throw new Error("Negotiation already exists for this booking");

  if (checkBookingId.status !== "Pending")
    throw new Error("Booking is not available for negotiation");

  const negotiationCode = await generateNegotiationCode();

  const newNegotiation = new negotiationModel({
    negotiationCode,
    ownerCompany,
    renterCompany,
    bookingId,
  });

  await newNegotiation.save();

  const { rentPrice, securityDeposit, rentalDuration, durationUnit, notes } =
    versionData;

  const firstVersion = await createVersion({
    negotiationId: newNegotiation._id,
    versionNumber: 1,
    rentPrice,
    securityDeposit,
    rentalDuration,
    durationUnit,
    counterBy: "ownerCompany",
    notes,
  });

  await negotiationModel.findByIdAndUpdate(
    newNegotiation._id,
    { currentVersion: firstVersion._id },
    { new: true },
  );

  await bookingModel.findByIdAndUpdate(
    bookingId,
    { status: "InNegotiation" },
    { new: true, runValidators: true },
  );

  const negotiation = await negotiationModel
    .findById(newNegotiation._id)
    .populate("currentVersion")
    .populate("bookingId")
    .populate("ownerCompany")
    .populate("renterCompany");

  return negotiation;
};

const createOffer = async (offerData) => {
  const {
    negotiationId,
    rentPrice,
    securityDeposit,
    rentalDuration,
    durationUnit,
    counterBy,
    notes,
  } = offerData;

  let lastVersion = await versionModel
    .findOne({ negotiationId, isLatest: true })
    .populate("negotiationId");

  // Fallback for older data that doesn't have isLatest: true
  if (!lastVersion) {
    lastVersion = await versionModel
      .findOne({ negotiationId })
      .sort({ createdAt: -1 })
      .populate("negotiationId");
  }

  if (!lastVersion)
    throw new Error(
      "Not found at least version 1 please create Negotiation first",
    );
  if (!lastVersion.negotiationId.isActive)
    throw new Error("Sorry, This negotiation not active");
  
  // If we fell back to an older version that explicitly has isLatest: false,
  // it means a previous counter offer failed halfway and corrupted the state.
  // We will allow editing it (which essentially heals the state by creating a new isLatest: true version).
  if (lastVersion.isLatest === false) {
    console.warn(`Healing corrupted negotiation state for ${negotiationId}: treating version ${lastVersion.versionNumber} as latest.`);
  }
  if (!counterBy) throw new Error("Counter By is required");
  if (lastVersion.negotiationId.status !== "Pending")
    throw new Error("Negotiation already closed");
  if (lastVersion.counterBy === counterBy)
    throw new Error("Wait for the other company response");

  const booking = await bookingModel.findById(
    lastVersion.negotiationId.bookingId,
  );
  if (booking.status !== "InNegotiation")
    throw new Error("Sorry, you are not in Negotiation");

  if (
    lastVersion.rentPrice === rentPrice &&
    lastVersion.securityDeposit === securityDeposit &&
    lastVersion.rentalDuration === rentalDuration &&
    lastVersion.durationUnit === durationUnit
  )
    throw new Error("This Version not change any thing in negotiation");

  const newVersion = await createVersion({
    negotiationId: lastVersion.negotiationId._id,
    versionNumber: lastVersion.versionNumber + 1,
    rentPrice,
    securityDeposit,
    rentalDuration,
    durationUnit,
    counterBy,
    notes,
  });

  // Update old version only after new version is successfully created
  await versionModel.findByIdAndUpdate(
    lastVersion._id,
    { isLatest: false },
    { new: true },
  );

  await negotiationModel.findByIdAndUpdate(lastVersion.negotiationId._id, {
    currentVersion: newVersion._id,
  });

  return newVersion;
};

const getNegotiation = async (id) => {
  const { companyId } = id;
  const negotiations = await negotiationModel.find({
    $or: [{ ownerCompany: companyId }, { renterCompany: companyId }],
  })
  .populate({
    path: "bookingId",
    populate: { path: "assetId" }
  })
  .populate("ownerCompany", "companyName logo")
  .populate("renterCompany", "companyName logo")
  .populate("currentVersion")
  .sort({ createdAt: -1 });
  
  return negotiations;
};

const getVersionHistory = async (negotiationId) => {
  const History = await versionModel
    .find({ negotiationId })
    .sort({ createdAt: 1 });
  if (History.length === 0) {
    return [];
  }
  return History;
};

const getCurrentNegotiation = async (companyId) => {
  const negotiation = await negotiationModel
    .findOne({
      $or: [{ ownerCompany: companyId }, { renterCompany: companyId }],
    })
    .sort({ createdAt: -1 })
    .populate("currentVersion");

  if (!negotiation) throw new Error("this negotiotion not found");
  return negotiation;
};

const acceptOffer = async (offerData) => {
  const { negotiationId, bookingId } = offerData;
  if (!negotiationId) throw new Error("negotiationId is requied");
  if (!bookingId) throw new Error("Booking ID is required");

  let acceptVersion = await versionModel
    .findOne({ negotiationId, isLatest: true })
    .populate("negotiationId");

  if (!acceptVersion) {
    acceptVersion = await versionModel
      .findOne({ negotiationId })
      .sort({ createdAt: -1 })
      .populate("negotiationId");
  }
  if (!acceptVersion) throw new Error("Negotiation not found");
  if (acceptVersion.negotiationId.status !== "Pending")
    throw new Error("Negotiation already closed");
  await negotiationModel.findByIdAndUpdate(negotiationId, {
    status: "Approved",
    isActive: false,
  });
  await bookingModel.findByIdAndUpdate(bookingId, {
    status: "Confirmed",
  });

  await contractService.createContract({
    bookingId,
    securityDeposit: acceptVersion.securityDeposit,
  });
};

const rejectOffer = async (offerData) => {
  const { negotiationId, bookingId } = offerData;
  if (!negotiationId) throw new Error("negotiationId is requied");
  if (!bookingId) throw new Error("Booking ID is required");

  let rejectVersion = await versionModel
    .findOne({ negotiationId, isLatest: true })
    .populate("negotiationId");

  if (!rejectVersion) {
    rejectVersion = await versionModel
      .findOne({ negotiationId })
      .sort({ createdAt: -1 })
      .populate("negotiationId");
  }
  if (!rejectVersion) throw new Error("Negotiation not found");
  if (rejectVersion.negotiationId.status !== "Pending")
    throw new Error("Negotiation already closed");
  await negotiationModel.findByIdAndUpdate(negotiationId, {
    status: "Rejected",
    isActive: false,
  });
  await bookingModel.findByIdAndUpdate(bookingId, {
    status: "Rejected",
  });

  // Revert the asset status back to Available
  const booking = await bookingModel.findById(bookingId);
  if (booking && booking.assetId) {
    const assetModel = require("../models/asset.model");
    await assetModel.findByIdAndUpdate(booking.assetId, {
      status: "Available"
    });
  }

  return;
};

module.exports = {
  createNegotiation,
  createOffer,
  getCurrentNegotiation,
  getNegotiation,
  getVersionHistory,
  acceptOffer,
  rejectOffer,
};
