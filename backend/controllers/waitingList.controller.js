const waitingListService = require("../services/waitingList.service");

const joinWaitingList = async (req, res) => {
  try {
    const waiting = await waitingListService.joinWaitingList(req.body);

    return res.status(201).send(waiting);
  } catch (err) {
    return res.status(err.statusCode || 500).send(err.message);
  }
};

const getWaitingListByAsset = async (req, res) => {
  try {
    const waitingList = await waitingListService.getWaitingListByAsset(
      req.params.assetId,
    );

    return res.status(200).send(waitingList);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const removeFromWaitingList = async (req, res) => {
  try {
    const result = await waitingListService.removeFromWaitingList(
      req.params.id,
    );

    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

module.exports = {
  joinWaitingList,
  getWaitingListByAsset,
  removeFromWaitingList,
};
