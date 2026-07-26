const inspectionService = require("../services/inspection.service");
const createInspection = async (req, res) => {
    try {
        const inspection = await inspectionService.createInspection(req.body)
        res.status(201).send("Inspection created successfully")
    } catch (err) {
        res.status(400).send(err.message)
    }
};
module.exports = {createInspection}