const assetReportService = require("../services/assetReport.service");

const getAssetUsage = async (req, res, next) => {
  try {
    const report = await assetReportService.getAssetUsageReport();
    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

const getAssetUtilization = async (req, res, next) => {
  try {
    const report = await assetReportService.getAssetUtilization();
    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

const getMaintenanceCost = async (req, res, next) => {
  try {
    const report = await assetReportService.getMaintenanceCostReport();
    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

const getReplacementCandidates = async (req, res, next) => {
  try {
    const report = await assetReportService.getReplacementCandidates();
    return res.status(200).json({ success: true, count: report.length, data: report });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssetUsage,
  getAssetUtilization,
  getMaintenanceCost,
  getReplacementCandidates
};