const IdempotencyKey = require("../models/idempotency.model");

const requireIdempotency = async (req, res, next) => {
  const idempotencyKey = req.headers["x-idempotency-key"];

  if (!idempotencyKey) {
    return res.status(400).json({
      success: false,
      message: "x-idempotency-key header is required for this operation"
    });
  }

  try {
    // Check if the key already exists
    const existingRecord = await IdempotencyKey.findOne({ key: idempotencyKey });

    if (existingRecord) {
      // Path mismatch check to prevent key reuse across different endpoints
      if (existingRecord.path !== req.path) {
        return res.status(400).json({
          success: false,
          message: "Idempotency key is already used for a different operation"
        });
      }

      // Return the cached response
      return res.status(existingRecord.statusCode).json(existingRecord.responseBody);
    }

    // Intercept res.json to cache the response
    const originalJson = res.json;
    res.json = function (body) {
      // Save the record asynchronously (fire and forget)
      IdempotencyKey.create({
        key: idempotencyKey,
        responseBody: body,
        statusCode: res.statusCode,
        path: req.path
      }).catch(err => {
        console.error("Failed to save idempotency key:", err);
      });

      // Call the original res.json
      return originalJson.call(this, body);
    };

    next();
  } catch (error) {
    console.error("Idempotency Middleware Error:", error);
    next(error);
  }
};

module.exports = requireIdempotency;
