const assetHealthService = require("../services/assetHealth.service");

const createAssetHealth = async (req, res) => {
    try{
        const assetHealth = await assetHealthService.createAssetHealth(req.body);

        res.status(201).send("Asset Health created successfully");

    }catch (err){
        res.status(400).send(err.message);
    }
};
const updateAssetHealth = async (req, res) => {
    try {
        const assetHealth = await assetHealthService.updateAssetHealth(
            req.params.assetId,
            req.body
        );

        res.status(200).send("Asset Health updated successfully");

    } catch (err) {

        res.status(400).send(err.message)
    }
};
module.exports = {createAssetHealth,updateAssetHealth};