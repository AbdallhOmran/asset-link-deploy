const deliveryModel = require("../models/delivery.model");
const bookingModel = require("../models/booking.model");
const contractModel = require("../models/contract.model");

const generateDeliveryCode = require("../utils/generateDeliveryCode");

const DELIVERY_STATUS = ["Preparing", "Picked Up", "In Transit", "Delivered"];

const createDelivery = async (deliveryData) => {
  const {
    bookingId,
    contractId,
    pickupLocation,
    deliveryLocation,
    driverName,
    driverPhone,
    estimatedArrival,
  } = deliveryData;

  if (!bookingId) throw new Error("bookingId is required");
  if (!contractId) throw new Error("contractId is required");
  if (!pickupLocation) throw new Error("pickupLocation is required");
  if (!deliveryLocation) throw new Error("deliveryLocation is required");
  if (!driverName) throw new Error("driverName is required");
  if (!driverPhone) throw new Error("driverPhone is required");
  if (!estimatedArrival) throw new Error("estimatedArrival is required");

  const booking = await bookingModel.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  const contract = await contractModel.findById(contractId);

  if (!contract) {
    throw new Error("Contract not found");
  }

  if (contract.status !== "Active") {
    throw new Error("Contract must be Active");
  }

  if (String(contract.bookingId) !== String(bookingId)) {
    throw new Error("Booking does not belong to this contract");
  }

  const existingDelivery = await deliveryModel.findOne({
    $or: [{ bookingId }, { contractId }],
  });

  if (existingDelivery) {
    throw new Error("Delivery already exists");
  }

  // TODO:
  
  // Check Escrow Payment after Escrow module is merged

  const deliveryCode = await generateDeliveryCode();

  const delivery = new deliveryModel({
    deliveryCode,

    bookingId,

    contractId,

    pickupLocation,

    deliveryLocation,

    driverName,

    driverPhone,

    estimatedArrival,

    status: "Preparing",

    statusHistory: [
      {
        status: "Preparing",
        changedAt: new Date(),
      },
    ],
  });

  await delivery.save();

  return delivery;
};
const getDeliveryById = async (id) => {
  const delivery = await deliveryModel
    .findById(id)
    .populate("bookingId")
    .populate("contractId");

  if (!delivery) {
    throw new Error("Delivery not found");
  }

  return delivery;
};

const updateDeliveryStatus = async (id, statusData) => {
  const { status } = statusData;

  if (!DELIVERY_STATUS.includes(status)) {
    throw new Error("Invalid delivery status");
  }

  const delivery = await deliveryModel.findById(id);

  if (!delivery) {
    throw new Error("Delivery not found");
  }

  const currentIndex = DELIVERY_STATUS.indexOf(delivery.status);

  const nextIndex = DELIVERY_STATUS.indexOf(status);

  if (nextIndex <= currentIndex) {
    throw new Error("Invalid delivery status update");
  }

  if (nextIndex - currentIndex > 1) {
    throw new Error("Delivery status must follow the correct order");
  }

  delivery.status = status;

  delivery.statusHistory.push({
    status,

    changedAt: new Date(),
  });

  if (status === "Delivered") {
    delivery.actualArrival = new Date();

    // TODO:
    // Start Inspection workflow after Inspection module is merged
  }

  await delivery.save();

  return delivery;
};
const getDeliveryTimeline = async (id) => {
  const delivery = await deliveryModel.findById(id);

  if (!delivery) {
    throw new Error("Delivery not found");
  }

  return delivery.statusHistory.sort((a, b) => a.changedAt - b.changedAt);
};

const getDeliveryHistory = async () => {
  const deliveries = await deliveryModel
    .find()
    .populate("bookingId")
    .populate("contractId")
    .sort({ createdAt: -1 });

  return deliveries;
};

module.exports = {
  createDelivery,

  getDeliveryById,

  updateDeliveryStatus,

  getDeliveryTimeline,

  getDeliveryHistory,
};
