const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

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

const getAllContracts = async (companyId) => {

  const contracts = await contractModel
    .find({
      $or: [
        { companyId: companyId },
        { ownerCompanyId: companyId }
      ]
    })
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



const generateContractPDF = async (contractId) => {
  const contract = await contractModel.findById(contractId)
    .populate({
      path: "bookingId",
      populate: [
        { path: "assetId" },
        { path: "companyId" },
        { path: "ownerCompanyId" }
      ]
    });

  if (!contract) {
    throw new Error("Contract not found");
  }

  if (contract.status !== "Approved" && contract.status !== "Active" && contract.status !== "Draft") {
    throw new Error("Contract must be Draft, Approved or Active before generating PDF");
  }

  const latestContract = await contractModel
    .findOne({ bookingId: contract.bookingId._id })
    .sort({ version: -1 });

  if (latestContract._id.toString() !== contract._id.toString()) {
    throw new Error("PDF can only be generated for the latest contract version");
  }

  const uploadPath = path.join(__dirname, "../uploads/contracts");

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const fileName = `contract-${contract._id}-v${contract.version}.pdf`;
  const filePath = path.join(uploadPath, fileName);

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  // Header
  doc.fontSize(20).text("Rental Contract", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Contract ID: ${contract._id}`);
  doc.text(`Version: ${contract.version}`);
  doc.moveDown();

  // Company Information
  doc.fontSize(16).text("Company Information");
  doc.fontSize(12).text(`Renter Company: ${contract.bookingId.companyId.companyName}`);
  doc.text(`Owner Company: ${contract.bookingId.ownerCompanyId.companyName}`);
  doc.moveDown();

  // Asset Information
  doc.fontSize(16).text("Asset Information");
  doc.fontSize(12).text(`Asset Name: ${contract.bookingId.assetId.assetName}`);
  doc.text(`Asset Code: ${contract.bookingId.assetId.assetCode}`);
  doc.moveDown();

  // Rental Details
  doc.fontSize(16).text("Rental Details");
  doc.fontSize(12).text(`Start Date: ${contract.bookingId.startDate}`);
  doc.text(`End Date: ${contract.bookingId.endDate}`);
  doc.text(`Total Price: ${contract.bookingId.totalPrice}`);
  doc.moveDown();

  // Terms & Conditions
  doc.fontSize(16).text("Terms & Conditions");
  doc.fontSize(12).text("1. The renter is responsible for using the asset properly.");
  doc.text("2. Any damage caused during the rental period is the renter's responsibility.");
  doc.text("3. The asset must be returned on the agreed end date.");
  doc.moveDown();

  // Signature Section
  doc.fontSize(16).text("Signatures");
  doc.moveDown();
  doc.text("Owner Company Signature: ____________________");
  doc.moveDown();
  doc.text("Renter Company Signature: ____________________");
  doc.moveDown();

  // Footer
  doc.text("----------------------------------------", { align: "center" });
  doc.text("AssetLink Rental Platform", { align: "center" });

  doc.end();

  contract.pdfPath = filePath;
  await contract.save();

  return contract;
};

const downloadContractPDF = async (contractId) => {
  const contract = await contractModel.findById(contractId);

  if (!contract) {
    throw new Error("Contract not found");
  }

  if (!contract.pdfPath) {
    throw new Error("PDF not generated yet");
  }

  return contract.pdfPath;
};

const viewContractPDF = async (contractId) => {
  const contract = await contractModel.findById(contractId);

  if (!contract) {
    throw new Error("Contract not found");
  }

  if (!contract.pdfPath) {
    throw new Error("PDF not generated yet");
  }

  return contract.pdfPath;
};


module.exports = {
  createContract,
  getAllContracts,
  getContractById,
  approveContract,
  rejectContract,
  generateContractPDF,
  downloadContractPDF,
  viewContractPDF,
};
