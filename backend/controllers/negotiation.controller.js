const negotiationService = require("../services/negotiation.service");

const createNegotiation = async (req, res) => {
  try {
    const negotiation = await negotiationService.createNegotiation(
      req.body.negotiationData,
      req.body.versionData,
    );

    // استخراج الـ ID بأمان سواء كان Mongoose Document أو Object عادي
    const negotiationId = negotiation?._id || negotiation?.id || negotiation;

    return res.status(201).json({
      success: true,
      message: "Negotiation is created successfully",
      data: negotiation,
      _id: negotiationId,
      negotiationId: negotiationId,
      negotiation: negotiation,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const createOffer = async (req, res) => {
  try {
    const offerData = { ...req.body, negotiationId: req.params.negotiationId, userId: req.user.id };
    const newVersion = await negotiationService.createOffer(offerData);
    return res.status(201).json({
      success: true,
      message: "New Version is created successfully",
      data: newVersion,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getNegotiation = async (req, res) => {
  try {
    const targetCompanyId = req.user.role === "Admin" ? req.params.id : req.user.id;
    const Negotiation = await negotiationService.getNegotiation({
      companyId: targetCompanyId,
    });
    return res.status(200).json({
      success: true,
      data: Negotiation,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getNegotiationById = async (req, res) => {
  try {
    const Negotiation = await negotiationService.getNegotiationById(req.params.id);
    return res.status(200).json({
      success: true,
      data: Negotiation,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getVersionHistory = async (req, res) => {
  try {
    const history = await negotiationService.getVersionHistory(req.params.id);
    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getCurrentNegotiation = async (req, res) => {
  try {
    const targetCompanyId = req.user.role === "Admin" ? req.params.id : req.user.id;
    const currentNegotiation = await negotiationService.getCurrentNegotiation(
      targetCompanyId,
    );
    return res.status(200).json({
      success: true,
      data: currentNegotiation,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const acceptOffer = async (req, res) => {
  try {
    const payload = { ...req.body, negotiationId: req.params.id, userId: req.user.id };
    const accept = await negotiationService.acceptOffer(payload);
    return res.status(200).json({
      success: true,
      data: accept,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const rejectOffer = async (req, res) => {
  try {
    const payload = { ...req.body, negotiationId: req.params.id, userId: req.user.id };
    const reject = await negotiationService.rejectOffer(payload);
    return res.status(200).json({
      success: true,
      data: reject,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  createNegotiation,
  createOffer,
  getNegotiation,
  getNegotiationById,
  getVersionHistory,
  getCurrentNegotiation,
  acceptOffer,
  rejectOffer,
};
