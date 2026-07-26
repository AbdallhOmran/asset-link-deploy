const deliveryModel = require("../models/delivery.model");
// Utility function to generate a unique delivery code
const generateDeliveryCode = async () => {
  const lastDelivery = await deliveryModel.findOne().sort({ createdAt: -1 });

  if (!lastDelivery) {
    return "DL-000001";
  }

  const lastCode = lastDelivery.deliveryCode;

  const lastNumber = parseInt(lastCode.split("-")[1]);

  const newNumber = lastNumber + 1;

  return `DL-${newNumber.toString().padStart(6, "0")}`;
};

module.exports = generateDeliveryCode;
