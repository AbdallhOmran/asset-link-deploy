const inspectionService = require("../services/inspection.service");

const createInspection = async (req, res) => {
  try {
    const inspection = await inspectionService.createInspection(req.body);
    return res.status(201).json({
      success: true,
      message: "Inspection created successfully",
      data: inspection,
    });
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).json({ success: false, message: err.message });
    }
    if (err.message.includes("already exists")) {
      return res.status(409).json({ success: false, message: err.message });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getAllInspections = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      assetId: req.query.assetId,
      bookingId: req.query.bookingId,
      inspectionType: req.query.inspectionType,
    };

    const inspections = await inspectionService.getAllInspections(
      filters,
      req.user
    );

    return res.status(200).json({
      success: true,
      count: inspections.length,
      data: inspections,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getInspectionById = async (req, res) => {
  try {
    const inspection = await inspectionService.getInspectionById(req.params.id);
    return res.status(200).json({ success: true, data: inspection });
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getInspectionByBooking = async (req, res) => {
  try {
    const inspection = await inspectionService.getInspectionByBooking(
      req.params.bookingId
    );
    return res.status(200).json({ success: true, data: inspection });
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getInspectionsByAsset = async (req, res) => {
  try {
    const inspections = await inspectionService.getInspectionsByAsset(
      req.params.assetId
    );
    return res.status(200).json({
      success: true,
      count: inspections.length,
      data: inspections,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateInspection = async (req, res) => {
  try {
    const inspection = await inspectionService.updateInspection(
      req.params.id,
      req.body
    );
    return res.status(200).json({
      success: true,
      message: "Inspection updated successfully",
      data: inspection,
    });
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).json({ success: false, message: err.message });
    }
    if (err.message.includes("Invalid") || err.message.includes("required")) {
      return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteInspection = async (req, res) => {
  try {
    const result = await inspectionService.deleteInspection(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).json({ success: false, message: err.message });
    }
    if (err.message.includes("Cannot delete")) {
      return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createInspection,
  getAllInspections,
  getInspectionById,
  getInspectionByBooking,
  getInspectionsByAsset,
  updateInspection,
  deleteInspection,
};