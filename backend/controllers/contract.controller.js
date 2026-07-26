const contractService = require("../services/contract.service");

const createContract = async (req, res) => {
  try {
    const contract = await contractService.createContract(req.body);
    return res.status(201).send(contract);
  } catch (err) {
    if (
      err.message.includes("required") ||
      err.message.includes("not found") ||
      err.message.includes("already exists")
    ) {
      return res.status(400).send({ error: err.message });
    }

    return res.status(500).send({ error: err.message });
  }
};

const getContracts = async (req, res) => {
  try {
    const contracts = await contractService.getAllContracts();
    return res.status(200).send(contracts);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};

const getContract = async (req, res) => {
  try {
    const contract = await contractService.getContractById(req.params.id);
    return res.status(200).send(contract);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).send({ error: err.message });
    }

    return res.status(500).send({ error: err.message });
  }
};

const approveContract = async (req, res) => {
  try {
    const contract = await contractService.approveContract(
      req.params.id,
      req.user.id,
    );

    return res.status(200).send(contract);
  } catch (err) {
    if (
      err.message.includes("not found") ||
      err.message.includes("Only draft") ||
      err.message.includes("Only owner")
    ) {
      return res.status(400).send({ error: err.message });
    }

    return res.status(500).send({ error: err.message });
  }
};

const rejectContract = async (req, res) => {
  try {
    const contract = await contractService.rejectContract(
      req.params.id,
      req.user.id,
    );

    return res.status(200).send(contract);
  } catch (err) {
    if (
      err.message.includes("not found") ||
      err.message.includes("Only draft") ||
      err.message.includes("Only owner")
    ) {
      return res.status(400).send({ error: err.message });
    }

    return res.status(500).send({ error: err.message });
  }
};

module.exports = {
  createContract,
  getContracts,
  getContract,
  approveContract,
  rejectContract,
};
