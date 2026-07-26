const negotiationModel = require('../models/nagotiation.model')
const versionModel = require('../models/version.model')
const bookingModel = require('../models/booking.model');
const companyModel = require('../models/company.model');

const generateNegotiationCode = async () =>{

  const lastNegotiation = await negotiationModel.findOne().sort({createdAt: -1});
  if(!lastNegotiation) return "NG-00001";

  const lastCode = lastNegotiation.negotiationCode
  const lastNumber = parseInt(lastCode.split("-")[1])
  const newNumber = lastNumber + 1;
  const newCode = `NG-${newNumber.toString().padStart(4,"0")}`
  return newCode;
}

const createVersion = async ({
    negotiationId,
    versionNumber,
    rentPrice,
    securityDeposit,
    rentalDuration,
    durationUnit,
    counterBy,
    notes
}) => {

    if(rentPrice == null) throw new Error("Rent price is required");
    if(securityDeposit == null) throw new Error("Security Deposit is requierd");
    if(rentalDuration == null || rentalDuration <= 0) throw new Error("Rental Duration is required");
    if(!durationUnit) throw new Error("Duration Unit is required");

      const version = new versionModel({
        negotiationId,
        versionNumber,
        rentPrice,
        securityDeposit,
        rentalDuration,
        durationUnit,
        counterBy,
        notes
    });

   await version.save();

   return version
}

const createNegotiation = async (negotiationData, versionData) =>{
  const {
    ownerCompany,
    renterCompany,
    bookingId,
   } = negotiationData;

   if(!ownerCompany) throw new Error("Owner Company is required")
   if(!renterCompany) throw new Error("Renter Company is required")
   if(!bookingId) throw new Error("Booking ID is required")
  
   const checkOwnerCompany = await companyModel.findById(ownerCompany)
   const checkRenterCompany = await companyModel.findById(renterCompany)
   if(!checkOwnerCompany || !checkRenterCompany) throw new Error("This Company not found");

   const checkBookingId = await bookingModel.findById(bookingId);
   if(!checkBookingId) throw new Error("This Booking is not found");

   const existingNegotiation = await negotiationModel.findOne({ bookingId });
   if(existingNegotiation) throw new Error("Negotiation already exists for this booking");

   if(checkBookingId.status !== "Pending") throw new Error("Booking is not available for negotiation");


   const negotiationCode = await generateNegotiationCode();

   const newNegotiation = new negotiationModel({
    negotiationCode,
    ownerCompany,
    renterCompany,
    bookingId,
   });

   await newNegotiation.save();

   const {
    rentPrice,
    securityDeposit,
    rentalDuration,
    durationUnit,
    notes
    } = versionData;

   const firstVersion = await createVersion({
    negotiationId: newNegotiation._id,
    versionNumber:1,
    rentPrice,
    securityDeposit,
    rentalDuration,
    durationUnit,
    counterBy:"ownerCompany",
    notes
});
   
   //update current version to version 1
   await negotiationModel.findByIdAndUpdate(newNegotiation._id, {currentVersion: firstVersion._id},{new: true});
   
   //update bookingId to InNegotiation
   await bookingModel.findByIdAndUpdate(bookingId,{status: "InNegotiation"}, { new: true, runValidators: true });

   const negotiation = await negotiationModel
    .findById(newNegotiation._id)
    .populate("currentVersion")
    .populate("bookingId")
    .populate("ownerCompany")
    .populate("renterCompany");

    return negotiation;
}

//-------------------------------------------

// create new version
const createOffer = async (offerData) =>{

  const {
    negotiationId,
    rentPrice,
    securityDeposit,
    rentalDuration,
    durationUnit,
    counterBy,
    notes
  } = offerData;

  const lastVersion = await versionModel.findOne({negotiationId, isLatest: true}).populate("negotiationId");

  if(!lastVersion) throw new Error("Not found at least version 1 please create Negotiation first");

  if(!lastVersion.negotiationId.isActive) throw new Error("Sorry, This negotiation not active");
  
  if(!lastVersion.isLatest) throw new Error("Can't edit this version");

  if(!counterBy) throw new Error("Counter By is required");

  if(lastVersion.negotiationId.status !== "Pending") throw new Error("Negotiation already closed");

  if(lastVersion.counterBy === counterBy) throw new Error("Wait for the other company response");

  const booking = await bookingModel.findById(lastVersion.negotiationId.bookingId);
  if(booking.status !== "InNegotiation" ) throw new Error("Sorry, you are not in Negotiation")
  
  if(
    lastVersion.rentPrice === rentPrice &&
    lastVersion.securityDeposit === securityDeposit &&
    lastVersion.rentalDuration === rentalDuration && 
    lastVersion.durationUnit === durationUnit
  )
    throw new Error("This Version not change any thing in negotiation")
  await versionModel.findByIdAndUpdate(lastVersion._id, {isLatest: false}, {new: true});

  const newVersion = await createVersion({
    negotiationId: lastVersion.negotiationId._id,
    versionNumber:lastVersion.versionNumber + 1,
    rentPrice,
    securityDeposit,
    rentalDuration,
    durationUnit,
    counterBy,
    notes
  })

  await negotiationModel.findByIdAndUpdate(lastVersion.negotiationId._id, {currentVersion: newVersion._id})

  return newVersion;
}

//Get Negotiation
const getNegotiation = async (id) => {
  const {companyId} = id
  const negotiations = await negotiationModel.find({$or:[{ownerCompany: companyId}, {renterCompany: companyId}]})
  if(negotiations.length === 0

  ) throw new Error("this negotiotion not found")

  return negotiations
}

// get Version History
const getVersionHistory = async (negotiationId) => {
  const History = await versionModel.find({negotiationId}).sort({createdAt: 1});
  if(History.length === 0) {
    return []
  }

  return History
}

// get Current Negotiation
const getCurrentNegotiation = async (companyId) => {
  const negotiation = await negotiationModel.findOne({$or:[{ownerCompany: companyId}, {renterCompany: companyId}]}).sort({createdAt: -1})
  if(!negotiation) throw new Error("this negotiotion not found")

  return negotiation
}

//accept Offer
const acceptOffer = async (offerData) => {
  const {negotiationId, bookingId} = offerData
    if(!negotiationId) throw new Error("negotiationId is requied");
   if(!bookingId) throw new Error("Booking ID is required")
    
    const acceptVersion = await versionModel.findOne({negotiationId, isLatest:true}).populate("negotiationId")
    if(!acceptVersion) throw new Error("Negotiation not found");
    if(acceptVersion.negotiationId.status !== "Pending")throw new Error("Negotiation already closed");    
    await negotiationModel.findByIdAndUpdate(negotiationId,
      {
        status: "Approved",
        isActive:false
      }
    )
    await bookingModel.findByIdAndUpdate(bookingId,{
      status: "Confirmed"
    })

    await contractService.createContract()
    
}


//reject Offer
const rejectOffer = async (offerData) => {
    const {negotiationId, bookingId} = offerData
    if(!negotiationId) throw new Error("negotiationId is requied");
   if(!bookingId) throw new Error("Booking ID is required")

    const rejectVersion = await versionModel.findOne({negotiationId, isLatest:true}).populate("negotiationId")
    if(!rejectVersion) throw new Error("Negotiation not found");
    if(rejectVersion.negotiationId.status !== "Pending")throw new Error("Negotiation already closed");    
    await negotiationModel.findByIdAndUpdate(negotiationId,
      {
        status: "Rejected",
        isActive:false
      }
    )
    await bookingModel.findByIdAndUpdate(bookingId,{
      status: "Rejected"
    })
    return 
}

module.exports = {createNegotiation, createOffer, getCurrentNegotiation, getNegotiation, getVersionHistory, acceptOffer ,rejectOffer}