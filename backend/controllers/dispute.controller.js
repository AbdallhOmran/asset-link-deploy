const disputeService = require("../services/dispute.service");

const openDispute = async (req, res) => {
  try {
    const newDispute = await disputeService.openDispute(req.body);
    return res.status(201).send(newDispute);
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

const resolveDispute = async (req, res) => {
  try {
    const result = await disputeService.resolveDispute(req.params.id, req.body);
    return res.status(200).send(result);
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

module.exports = { openDispute, resolveDispute };
