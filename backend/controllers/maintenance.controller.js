const maintenanceService = require("../services/maintenance.service");

const createMaintenance = async (req, res) => {
  try {
    const maintenance = await maintenanceService.createMaintenance(req.body);
    return res.status(201).send(maintenance);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).send({ error: err.message });
    }

    if (err.message.includes("required") || err.message.includes("Invalid")) {
      return res.status(400).send({ error: err.message });
    }

    return res.status(500).send({ error: err.message });
  }
};

const getMaintenance = async (req, res) => {
  try {
    const maintenance = await maintenanceService.getMaintenanceById(
      req.params.id,
    );
    return res.status(200).send(maintenance);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).send({ error: err.message });
    }

    return res.status(500).send({ error: err.message });
  }
};

const updateMaintenance = async (req, res) => {
  try {
    const maintenance = await maintenanceService.updateMaintenance(
      req.params.id,
      req.body,
    );

    return res.status(200).send(maintenance);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).send({ error: err.message });
    }

    if (err.message.includes("required") || err.message.includes("Invalid")) {
      return res.status(400).send({ error: err.message });
    }

    return res.status(500).send({ error: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const maintenance = await maintenanceService.updateMaintenanceStatus(
      req.params.id,
      req.body,
    );

    return res.status(200).send(maintenance);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).send({ error: err.message });
    }

    if (err.message.includes("required") || err.message.includes("Invalid")) {
      return res.status(400).send({ error: err.message });
    }

    return res.status(500).send({ error: err.message });
  }
};

const getMaintenanceHistory = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      assetId: req.query.assetId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };
    const maintenances = await maintenanceService.getMaintenanceHistory(filters);
    return res.status(200).json({
      success: true,
      count: maintenances.length,
      data: maintenances,
    });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};

const getMaintenanceByAsset = async (req, res) => {
  try {
    const maintenances = await maintenanceService.getMaintenanceByAsset(
      req.params.assetId
    );
    return res.status(200).json({
      success: true,
      count: maintenances.length,
      data: maintenances,
    });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};

const deleteMaintenance = async (req, res) => {
  try {
    const result = await maintenanceService.deleteMaintenance(req.params.id);
    return res.status(200).send(result);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).send({ error: err.message });
    }

    return res.status(500).send({ error: err.message });
  }
};

module.exports = {
  createMaintenance,
  getMaintenance,
  updateMaintenance,
  updateStatus,
  getMaintenanceHistory,
  getMaintenanceByAsset,
  deleteMaintenance,
};
