const inspectorService = require('../services/inspector.service');

const assignInspector = async (req, res) => {
  try {
    const assign = await inspectorService.assignInspector(req.body);
    return res.status(200).json({ success: true, data: assign });
  } catch (err) {
    const status = err.statusCode || 400;
    return res.status(status).json({ success: false, message: err.message });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const tasks = await inspectorService.getMyTasks(req.user.id);
    return res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    const status = err.statusCode || 400;
    return res.status(status).json({ success: false, message: err.message });
  }
};

const getInspectionHistory = async (req, res) => {
  try {
    const history = await inspectorService.getInspectionHistory(req.params.assetId);
    return res.status(200).json({ success: true, data: history });
  } catch (err) {
    const status = err.statusCode || 400;
    return res.status(status).json({ success: false, message: err.message });
  }
};

module.exports = { assignInspector, getMyTasks, getInspectionHistory };