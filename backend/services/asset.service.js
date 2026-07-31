const assetModel = require("../models/asset.model");
const companyModel = require("../models/company.model");
const assetCategoryModel = require("../models/assetCategory.model");
const bookingModel = require("../models/booking.model");

const generateCode = async () => {
  const lastAsset = await assetModel.findOne().sort({ createdAt: -1 });

  if (!lastAsset) {
    return "AST-0001";
  }

  const lastCode = lastAsset.assetCode;
  const lastNumber = parseInt(lastCode.split("-")[1]);
  const newNumber = lastNumber + 1;
  const assetCode = `AST-${newNumber.toString().padStart(4, "0")}`;

  return assetCode;
};

const addAsset = async (assetData) => {
  const {
    companyId,
    assetCategoryId,
    assetName,
    assetImages,
    description,
    price,
    status,
    location,
  } = assetData;

  const checkCompany = await companyModel.findById(companyId);
  if (!checkCompany) throw new Error("This Company not found");

  if (checkCompany.role !== 'Admin' && checkCompany.companyType === 'Renter') {
    throw new Error("Only Owners can add assets");
  }

  const checkCategory = await assetCategoryModel.findById(assetCategoryId);
  if (!checkCategory) throw new Error("This Category not found");

  if (!assetName) throw new Error("Name asset is required");
  if (!assetImages || assetImages.length === 0)
    throw new Error("Image of asset is required");
  if (!description) throw new Error("Description is required");
  if (!price || !price.daily)
    throw new Error("please add at least daily price");

  // Check for duplicate asset (same name for the same company)
  const duplicateAsset = await assetModel.findOne({ companyId, assetName });
  if (duplicateAsset) throw new Error("Asset with this name already exists for your company");

  const assetCode = await generateCode();

  const newAsset = new assetModel({
    assetCode,
    companyId,
    assetCategoryId,
    assetName,
    assetImages,
    description,
    price,
    status,
    location,
  });

  await newAsset.save();
  return newAsset;
};

const getAssets = async () => {
  const assets = await assetModel.find({ isActive: true })
    .populate("companyId")
    .populate("assetCategoryId");

  return assets;
};

const searchAssets = async (query) => {
  let filter = { isActive: true };

  if (query.name) {
    filter.assetName = {
      $regex: query.name,
      $options: "i",
    };
  }

  if (query.assetCode) {
    filter.assetCode = {
      $regex: query.assetCode,
      $options: "i",
    };
  }

  if (query.category) {
    filter.assetCategoryId = query.category;
  }

  if (query.location) {
    filter.location = {
      $regex: query.location,
      $options: "i",
    };
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.priceType && (query.minPrice || query.maxPrice)) {
    const price = `price.${query.priceType}`;

    filter[price] = {};

    if (query.minPrice) {
      filter[price].$gte = Number(query.minPrice);
    }

    if (query.maxPrice) {
      filter[price].$lte = Number(query.maxPrice);
    }
  }

  const assets = await assetModel.find(filter)
    .populate("companyId")
    .populate("assetCategoryId");

  return assets;
};

const getAssetDetails = async (id) => {
  const asset = await assetModel.findById(id)
    .populate("companyId")
    .populate("assetCategoryId");

  if (!asset) throw new Error("Asset not found");

  return asset;
};

const updateAsset = async (id, updateData) => {
  const updatedAsset = await assetModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedAsset) throw new Error("Asset not found");

  return updatedAsset;
};

const getAssetAvailability = async (assetId, startDate, endDate) => {
  const asset = await assetModel.findById(assetId);

  if (!asset) {
    throw new Error("Asset not found");
  }

  // If dates are not provided, return all active future bookings for the calendar
  if (!startDate || !endDate) {
    const bookings = await bookingModel.find({
      assetId: assetId,
      status: { $in: ["Pending", "Confirmed"] },
      endDate: { $gte: new Date() }
    }).select("startDate endDate status");
    return bookings;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    throw new Error("Start date must be before end date");
  }

  const existingBooking = await bookingModel.findOne({
    assetId: assetId,
    status: {
      $in: ["Pending", "Confirmed"],
    },
    startDate: {
      $lt: end,
    },
    endDate: {
      $gt: start,
    },
  });

  if (existingBooking) {
    return {
      available: false,
      message: "Asset is not available for the selected dates",
    };
  }

  return {
    available: true,
    message: "Asset is available",
  };
};

const getRecommendedAssets = async (query) => {
  const { location, maxPrice, limit = 10 } = query;
  // Fallback to "daily" if not provided, ensure lowercase for DB matching
  const priceType = (query.priceType || "daily").toLowerCase();

  const matchStage = {
    status: { $in: ["Available", "Booked"] },
    isActive: true
  };

  if (maxPrice) {
    matchStage[`price.${priceType}`] = { $lte: Number(maxPrice) };
  }

  // Base score out of 100
  // Available = 40 pts
  // Location match = 40 pts
  // Health Score = up to 20 pts (healthScore * 0.2)
  const scoreCalculation = [
    { $cond: [{ $eq: ["$status", "Available"] }, 40, 0] },
    { $multiply: [{ $ifNull: ["$healthScore", 100] }, 0.2] }
  ];

  if (location) {
    scoreCalculation.push({
      $cond: [
        { $regexMatch: { input: "$location", regex: location, options: "i" } },
        40, 
        0
      ]
    });
  }

  const pipeline = [
    { $match: matchStage }, 
    
    {
      $addFields: {
        recommendationScore: { $add: scoreCalculation } 
      }
    },
    
    {
      $sort: {
        recommendationScore: -1,
        [`price.${priceType}`]: 1 
      }
    },
    
    { $limit: Number(limit) },
    
    {
      $lookup: {
        from: "companies", 
        localField: "companyId",
        foreignField: "_id",
        as: "companyId"
      }
    },
    { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } }, 
    
    {
      $lookup: {
        from: "assetcategories",
        localField: "assetCategoryId",
        foreignField: "_id",
        as: "assetCategoryId"
      }
    },
    { $unwind: { path: "$assetCategoryId", preserveNullAndEmptyArrays: true } },
    
    {
      $project: {
        "companyId.password": 0, 
        "companyId.__v": 0,
        "assetCategoryId.__v": 0
      }
    }
  ];

  const recommendedAssets = await assetModel.aggregate(pipeline);

  return recommendedAssets;
};
const getMyAssets = async (id) => {
  const assets = await assetModel.find({ companyId: id })
    .populate("companyId")
    .populate("assetCategoryId");
  return assets;
};


module.exports = {
  addAsset,
  getAssets,
  getAssetDetails,
  updateAsset,
  searchAssets,
  getAssetAvailability,
  getRecommendedAssets,
  getMyAssets,
};