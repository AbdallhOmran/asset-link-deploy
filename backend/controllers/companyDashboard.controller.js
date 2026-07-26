const companyDashboardService = require("../services/companyDashboard.service");

// GET /api/company-dashboard/:companyId/reputation
const getCompanyReputation = async (req, res) => {
  try {
    const result = await companyDashboardService.getCompanyReputation(req.params.companyId);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// GET /api/company-dashboard/:companyId/rating
const getCompanyRating = async (req, res) => {
  try {
    const result = await companyDashboardService.getCompanyRating(req.params.companyId);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// GET /api/company-dashboard/delayed
const getDelayedCompanies = async (req, res) => {
  try {
    const result = await companyDashboardService.getDelayedCompanies();
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// GET /api/company-dashboard/:companyId/rental-duration
const getAverageRentalDuration = async (req, res) => {
  try {
    const result = await companyDashboardService.getAverageRentalDuration(req.params.companyId);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// GET /api/company-dashboard/:companyId/statistics
const getDashboardStatistics = async (req, res) => {
  try {
    const result = await companyDashboardService.getDashboardStatistics(req.params.companyId);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

module.exports = {
  getCompanyReputation,
  getCompanyRating,
  getDelayedCompanies,
  getAverageRentalDuration,
  getDashboardStatistics
};
