const finalInspectionService = require("../services/finalInspection.service");

const createFinalInspection = async (req, res) => {
  try {
    const finalInspection = await finalInspectionService.createFinalInspection(
      req.body
    );
    return res.status(201).send(finalInspection);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getFinalInspectionByBooking = async (req, res) => {
  try {
    const finalInspection = await finalInspectionService.getFinalInspectionByBooking(
      req.params.bookingId
    );
    if (!finalInspection) {
      return res.status(404).send("Final inspection not found");
    }
    return res.status(200).send(finalInspection);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getAllFinalInspections = async (req, res) => {
  try {
    const finalInspections = await finalInspectionService.getAllFinalInspections();
    return res.status(200).send(finalInspections);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

module.exports = {
  createFinalInspection,
  getFinalInspectionByBooking,
  getAllFinalInspections,
};