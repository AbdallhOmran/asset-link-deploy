const negotiationService = require('../services/negotiation.service')

const createNegotiation = async (req,res) => {
  try{
    const negotiation = await negotiationService.createNegotiation(req.body.negotiationData, req.body.versionData)
    return res.status(201).json({
      success:true,
      message: "Negotiation is created successfully",
      data: negotiation
    })
  }
  catch(err){
    return res.status(400).json({success:false, message: err.message})
  }
}

const createOffer = async (req, res) => { 
  try{
  const newVersion = await negotiationService.createOffer(req.body)
    return res.status(201).json({
      success:true,
      message: "New Version is created successfully",
      data: newVersion
    })
  }
  catch(err){
    return res.status(400).json({success:false, message: err.message})
  }
}

const getNegotiation = async (req,res) => {
  try{
  const Negotiation = await negotiationService.getNegotiation({companyId: req.params.id})
    return res.status(200).json({
      success:true,
      data: Negotiation
    })
  }
  catch(err){
    return res.status(400).json({success:false, message: err.message})
  }
}

const getVersionHistory = async (req, res) => {
  try{
  const history = await negotiationService.getVersionHistory(req.params.id)
    return res.status(200).json({
      success:true,
      data: history
    })
  }
  catch(err){
    return res.status(400).json({success:false, message: err.message})
  }
}

const getCurrentNegotiation = async (req, res) => {
  try{
  const currentNegotiation = await negotiationService.getCurrentNegotiation(req.params.id)
    return res.status(200).json({
      success:true,
      data: currentNegotiation
    })
  }
  catch(err){
    return res.status(400).json({success:false, message: err.message})
  }
}

const acceptOffer = async (req, res) => {
  try{
  const accept = await negotiationService.acceptOffer(req.body)
    return res.status(200).json({
      success:true,
      data: accept
    })
  }
  catch(err){
    return res.status(400).json({success:false, message: err.message})
  }
}

const rejectOffer = async (req, res) => {
  try{
  const reject = await negotiationService.rejectOffer(req.body)
    return res.status(200).json({
      success:true,
      data: reject
    })
  }
  catch(err){
    return res.status(400).json({success:false, message: err.message})
  }
}

module.exports = {
    createNegotiation,
    createOffer,
    getNegotiation,
    getVersionHistory,
    getCurrentNegotiation,
    acceptOffer,
    rejectOffer
};