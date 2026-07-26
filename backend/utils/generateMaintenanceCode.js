const maintenanceModel = require("../models/maintenance.model");

const generateMaintenanceCode = async () => {
  const lastMaintenance = await maintenanceModel
    .findOne()
    .sort({ createdAt: -1 });

  if (!lastMaintenance) {
    return "MT-000001";
  }

  const lastCode = lastMaintenance.maintenanceCode;

  const lastNumber = parseInt(lastCode.split("-")[1]);

  const newNumber = lastNumber + 1;

  return `MT-${newNumber.toString().padStart(6, "0")}`;
};

module.exports = generateMaintenanceCode;
