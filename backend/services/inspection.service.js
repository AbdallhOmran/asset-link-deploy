const Inspection = require("../models/inspection.model")
const Booking = require("../models/booking.model")

const createInspection = async (data) => {

    const booking = await Booking.findById(data.bookingId)

    if (!booking){
        throw new Error("Booking not found");
    }
    const existingInspection = await Inspection.findOne({
        bookingId: data.bookingId
    });

    if (existingInspection){
        throw new Error("Inspection already exists")
    }
    const inspection = await Inspection.create({
        bookingId: data.bookingId,
        assetId: data.assetId,
        inspectorName: data.inspectorName,
        photos: data.photos,
        notes: data.notes,
        checklist: data.checklist,
        conditionScore: data.conditionScore,
        status: data.status});
        if (data.status === "Failed") {
            booking.status = "Cancelled"
            booking.cancelReason = "Inspection failed"
            await booking.save()
}
if (data.status === "Passed") {
    booking.status = "Confirmed"
    await booking.save()
}
    return inspection
};
module.exports = {createInspection}