const deliveryService = require("../services/delivery.service");
// Controller for Delivery
const createDelivery = async (req, res) => {
  try {
    const delivery = await deliveryService.createDelivery(req.body);

    return res.status(201).send(delivery);
  } catch (err) {
    if (err.message.includes("required") || err.message.includes("Invalid")) {
      return res.status(400).send({
        error: err.message,
      });
    }

    if (err.message.includes("not found")) {
      return res.status(404).send({
        error: err.message,
      });
    }

    return res.status(500).send({
      error: err.message,
    });
  }
};

const getDelivery = async (req, res) => {
  try {
    const delivery = await deliveryService.getDeliveryById(req.params.id);

    return res.status(200).send(delivery);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).send({
        error: err.message,
      });
    }

    return res.status(500).send({
      error: err.message,
    });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const delivery = await deliveryService.updateDeliveryStatus(
      req.params.id,
      req.body,
    );

    return res.status(200).send(delivery);
  } catch (err) {
    if (
      err.message.includes("not found") ||
      err.message.includes("Invalid") ||
      err.message.includes("order")
    ) {
      return res.status(400).send({
        error: err.message,
      });
    }

    return res.status(500).send({
      error: err.message,
    });
  }
};

const getDeliveryTimeline = async (req, res) => {
  try {
    const timeline = await deliveryService.getDeliveryTimeline(req.params.id);

    return res.status(200).send(timeline);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).send({
        error: err.message,
      });
    }

    return res.status(500).send({
      error: err.message,
    });
  }
};

const getDeliveryHistory = async (req, res) => {
  try {
    const history = await deliveryService.getDeliveryHistory();

    return res.status(200).send(history);
  } catch (err) {
    return res.status(500).send({
      error: err.message,
    });
  }
};

module.exports = {
  createDelivery,

  getDelivery,

  updateDeliveryStatus,

  getDeliveryTimeline,

  getDeliveryHistory,
};
