const contractModel = require("../models/contract.model");
const bookingModel = require("../models/booking.model");
const generateContractCode = require("../utils/generateContractCode");

const createContract = async (contractData) => {
  const { bookingId, securityDeposit } = contractData;

  if (!bookingId) {
    throw new Error("bookingId is required");
  }

  if (securityDeposit === undefined || securityDeposit === null) {
    throw new Error("securityDeposit is required");
  }

  const booking = await bookingModel.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  const existingContract = await contractModel.findOne({ bookingId });

  if (existingContract) {
    throw new Error("Contract already exists for this booking");
  }

  const contractCode = await generateContractCode();

  const contract = new contractModel({
    contractCode,
    bookingId: booking._id,
    assetId: booking.assetId,
    companyId: booking.companyId,
    ownerCompanyId: booking.ownerCompanyId,
    startDate: booking.startDate,
    endDate: booking.endDate,
    totalPrice: booking.totalPrice,
    securityDeposit,
    status: "Draft",
  });

  await contract.save();

  return contract;
};

const getAllContracts = async () => {
  const contracts = await contractModel
    .find()
    .populate("bookingId")
    .populate("assetId")
    .populate("companyId")
    .populate("ownerCompanyId");

  return contracts;
};

const getContractById = async (id) => {
  const contract = await contractModel
    .findById(id)
    .populate("bookingId")
    .populate("assetId")
    .populate("companyId")
    .populate("ownerCompanyId");

  if (!contract) {
    throw new Error("Contract not found");
  }

  return contract;
};

const approveContract = async (id, userId) => {
  const contract = await contractModel.findById(id);

  if (!contract) {
    throw new Error("Contract not found");
  }

  if (contract.ownerCompanyId.toString() !== userId.toString()) {
    throw new Error("Only owner company can approve this contract");
  }

  if (contract.status !== "Draft") {
    throw new Error("Only draft contracts can be approved");
  }

  contract.status = "Active";
  contract.approvedAt = new Date();

  await contract.save();

  return contract;
};

const rejectContract = async (id, userId) => {
  const contract = await contractModel.findById(id);

  if (!contract) {
    throw new Error("Contract not found");
  }

  if (contract.ownerCompanyId.toString() !== userId.toString()) {
    throw new Error("Only owner company can reject this contract");
  }

  if (contract.status !== "Draft") {
    throw new Error("Only draft contracts can be rejected");
  }

  contract.status = "Rejected";
  contract.rejectedAt = new Date();

  await contract.save();

  return contract;
};

module.exports = {
  createContract,
  getAllContracts,
  getContractById,
  approveContract,
  rejectContract,
};
