const AssetCategoryModel = require('../models/assetCategory.model');


const addCategory = async (req, res) =>{
  try {
    const { assetCategoryName } = req.body;
    if (!assetCategoryName) {
      return res.status(400).send("Asset category name is required");
    }
     
    const checkCategory = await AssetCategoryModel.findOne({ assetCategoryName });
    
    if (checkCategory) {
      return res.status(409).send("Asset category already exists");
    }
    const newCategory = new AssetCategoryModel({ assetCategoryName });
    await newCategory.save();
    
    return res.status(201).send(newCategory);
  } catch(err) {
    return res.status(500).send(err.message);
  }
}

const viewCategories = async (req, res) =>{
  try{
  const categories = await AssetCategoryModel.find();
    
    return res.status(200).send(categories);

  }catch(err){
    console.error("viewCategories error:", err);
    return res.status(500).send(err.message);

  }
}

module.exports = {addCategory, viewCategories}