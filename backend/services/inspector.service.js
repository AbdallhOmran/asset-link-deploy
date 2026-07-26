const inspectorModel = require('../models/inspector.model')
const bookingModel = require('../models/booking.model')
const inspectionModel = require('../models/inspection.model');

const assignInspector = async (data) => {
  const {inspectorId, bookingId} = data;

  const booking = await bookingModel.findById(bookingId);
  if(!booking) throw new Error("This booking not found");

  if (booking.status !== "Confirmed") throw new Error("Cannot assign inspector. Booking must be Confirmed.");

  if(booking.assignedInspectorId) throw new Error("This booking already has an assigned inspector.");

  const inspector = await inspectorModel.findById(inspectorId);

  if(!inspector) throw new Error("This inpector not found");
  
  if(!inspector.isAvailable) throw new Error("Sorry, this inspector already is busy");


  booking.assignedInspectorId = inspectorId
  await booking.save()
  return booking;
}

const getMyTasks = async (inspectorId) => {
  const myTasks = await inspectionModel.find({inspectorId}).populate('bookingId');;
  if(myTasks.length === 0)
  return{
    success:true,
    message: "You don't have any inspections",
    data:[]
  }
  return{
    success:true,
    message: "Your inspections retrieved successfully",
    data:myTasks,
  }
}

const getInspectionHistory = async (assetId) => {
  const history = await inspectionModel.find({assetId})
  if(history.length === 0)
    return {
      success:true,
      message: "This asset don't have any inspections",
      data:[]
  }

  return{
    success:true,
    message: "Your inspections retrieved successfully",
    data:history,
  }
}

module.exports = {assignInspector, getMyTasks, getInspectionHistory}
