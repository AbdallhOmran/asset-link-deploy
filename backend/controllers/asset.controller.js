const assetService = require("../services/asset.service");

const addAsset = async (req, res) => {
  try {
    const newAsset = await assetService.addAsset(req.body);
    return res.status(201).json({
      success: true,
      message: "Asset added successfully",
      data: newAsset
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Note: a duplicated & broken `getAssets` definition was removed here (merge leftover) - Fixed by Eman
const getAssets = async (req, res) => {
  try {
    const assets = await assetService.getAssets();
    
    if(assets.length === 0 ) {
      return res.status(200).json({
        success: true,
        message: "No assets available right now",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      data: assets
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message }); 
  }
};

const getAssetDetails = async (req, res) => {
  try {
    const asset = await assetService.getAssetDetails(req.params.id);
    return res.status(200).json({
      success: true,
      data: asset
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

const updateAsset = async (req, res) => {
  try {
    const asset = await assetService.updateAsset(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Asset updated successfully",
      data: asset
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

const searchAssets = async (req,res)=>{
  try{
    const assets = await assetService.searchAssets(req.query)
    return res.status(200).send(assets);
  }catch(err){
    return res.status(500).send(err.message);
  }
}
const getAssetAvailability = async (req, res) => {
  try {
    const result = await assetService.getAssetAvailability(
      req.params.id,
      req.query.startDate,
      req.query.endDate
    );

    return res.status(200).json(result);

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  addAsset,
  getAssetDetails,
  updateAsset,
  getAssets,
  searchAssets,
  getAssetAvailability
};