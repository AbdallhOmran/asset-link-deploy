const mongoose = require("mongoose");
const maintenanceModel = require("../models/maintenance.model");
const assetModel = require("../models/asset.model");

const generateMaintenanceCode = require("../utils/generateMaintenanceCode");

const MAINTENANCE_STATUS = [
  "Pending",
  "Scheduled",
  "In Progress",
  "Completed",
  "Cancelled",
];

const createMaintenance = async (maintenanceData) => {
  const { assetId, issueDescription, maintenanceCost, maintenanceDate, notes } =
    maintenanceData;

  if (!assetId) throw new Error("assetId is required");
  if (!issueDescription) throw new Error("issueDescription is required");

  const asset = await assetModel.findById(assetId);

  if (!asset) {
    throw new Error("Asset not found");
  }

  // TODO:
  // Auto-create Maintenance after Damage module is merged

  const maintenanceCode = await generateMaintenanceCode();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const maintenance = new maintenanceModel({
      maintenanceCode,

      assetId,

      issueDescription,

      maintenanceCost,

      maintenanceDate,

      notes,
    });

    await maintenance.save({ session });

    const updatedAsset = await assetModel.findByIdAndUpdate(
      assetId,
      {
        status: "Maintenance",
      },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updatedAsset) {
      throw new Error("Failed to update asset status");
    }

    await session.commitTransaction();

    return maintenance;
  } catch (err) {
    await session.abortTransaction();

    throw err;
  } finally {
    session.endSession();
  }
};

const getMaintenanceById = async (id) => {
  const maintenance = await maintenanceModel.findById(id).populate("assetId");

  if (!maintenance) {
    throw new Error("Maintenance not found");
  }

  return maintenance;
};

const updateMaintenance = async (id, maintenanceData) => {
  const { issueDescription, maintenanceCost, maintenanceDate, notes } =
    maintenanceData;

  const maintenance = await maintenanceModel.findById(id);

  if (!maintenance) {
    throw new Error("Maintenance not found");
  }

  if (maintenance.status === "Completed") {
    throw new Error("Completed maintenance cannot be updated");
  }

  if (maintenance.status === "Cancelled") {
    throw new Error("Cancelled maintenance cannot be updated");
  }

  if (issueDescription !== undefined) {
    maintenance.issueDescription = issueDescription;
  }

  if (maintenanceCost !== undefined) {
    maintenance.maintenanceCost = maintenanceCost;
  }

  if (maintenanceDate !== undefined) {
    maintenance.maintenanceDate = maintenanceDate;
  }

  if (notes !== undefined) {
    maintenance.notes = notes;
  }

  await maintenance.save();

  return maintenance;
};

const updateMaintenanceStatus = async (id, statusData) => {
  const { status } = statusData;

  if (!MAINTENANCE_STATUS.includes(status)) {
    throw new Error("Invalid maintenance status");
  }

  const maintenance = await maintenanceModel.findById(id);

  if (!maintenance) {
    throw new Error("Maintenance not found");
  }

  if (
    status === "Completed" &&
    (maintenance.status === "Pending" || maintenance.status === "Scheduled")
  ) {
    throw new Error("Maintenance cannot be completed before it starts");
  }

  maintenance.status = status;

  if (status === "Completed") {
    maintenance.completedDate = new Date();

    // TODO:
    // Update Asset status to Available after Asset Lifecycle module is merged
  }

  await maintenance.save();

  return maintenance;
};

const getMaintenanceHistory = async () => {
  const maintenances = await maintenanceModel
    .find()
    .populate("assetId")
    .sort({ createdAt: -1 });

  return maintenances;
};

const deleteMaintenance = async (id) => {
  const maintenance = await maintenanceModel.findById(id);

  if (!maintenance) {
    throw new Error("Maintenance not found");
  }

  if (maintenance.status === "In Progress") {
    throw new Error("Maintenance in progress cannot be deleted");
  }

  if (maintenance.status === "Completed") {
    throw new Error("Completed maintenance cannot be deleted");
  }

  await maintenance.deleteOne();

  return {
    success: true,
    message: "Maintenance deleted successfully",
  };
};

module.exports = {
  createMaintenance,

  getMaintenanceById,

  updateMaintenance,

  updateMaintenanceStatus,

  getMaintenanceHistory,

  deleteMaintenance,
};
