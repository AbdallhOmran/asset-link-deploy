const revenueReportService = require("../services/revenueReport.service");

// GET /api/revenue-reports/total
const getTotalRevenue = async (req, res) => {
  try {
    const result = await revenueReportService.getTotalRevenue();
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// GET /api/revenue-reports/monthly
const getMonthlyRevenue = async (req, res) => {
  try {
    const result = await revenueReportService.getMonthlyRevenue();
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// GET /api/revenue-reports/company/:companyId
const getCompanyRevenue = async (req, res) => {
  try {
    const result = await revenueReportService.getCompanyRevenue(req.params.companyId);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// GET /api/revenue-reports/asset/:assetId
const getAssetRevenue = async (req, res) => {
  try {
    const result = await revenueReportService.getAssetRevenue(req.params.assetId);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

module.exports = {
  getTotalRevenue,
  getMonthlyRevenue,
  getCompanyRevenue,
  getAssetRevenue
};
