const penaltyService = require("../services/penalty.service");

// POST /api/penalty
const createPenalty = async (req, res) => {
  try {
    const result = await penaltyService.createPenalty(req.body);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

module.exports = {
  createPenalty
};
