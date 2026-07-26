const contractModel = require("../models/contract.model");

const generateContractCode = async () => {
  const lastContract = await contractModel.findOne().sort({ createdAt: -1 });

  if (!lastContract) {
    return "CT-000001";
  }

  const lastCode = lastContract.contractCode;

  if (!lastCode || !lastCode.includes("-")) {
    return "CT-000001";
  }

  const lastNumber = parseInt(lastCode.split("-")[1], 10);

  if (isNaN(lastNumber)) {
    return "CT-000001";
  }

  const newNumber = lastNumber + 1;

  return `CT-${newNumber.toString().padStart(6, "0")}`;
};

module.exports = generateContractCode;
