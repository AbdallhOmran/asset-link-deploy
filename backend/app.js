require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");

// Routes Import
const authRoutes = require("./routes/auth.routes");
const assetRouter = require("./routes/asset.routes");
const assetCategoryRouter = require("./routes/assetCategory.route");
const companyRoutes = require("./routes/company.routes");
const waitingListRoutes = require("./routes/waitingList.route");
const bookingRoutes = require("./routes/booking.routes");
const negotiationRoutes = require("./routes/negotiation.routes"); 
const finalInspection = require("./routes/finalInspection.routes");
const damageReport = require("./routes/damageReport.routes");
const contractRoutes = require("./routes/contract.routes");
const escrowRoutes = require("./routes/escrow.routes"); 
const inspectionRoutes = require("./routes/inspection.routes"); 
const rentalCompletionRoutes = require("./routes/rentalCompletion.routes");
const companyDashboardRoutes = require("./routes/companyDashboard.routes");
const revenueReportRoutes = require("./routes/revenueReport.routes");
const penaltyRoutes = require("./routes/penalty.routes");
const disputeRoutes = require("./routes/dispute.routes");
const paymentRoutes = require("./routes/payment.routes");
const assetLifecycle = require("./routes/assetLifecycle.routes"); 
const inspectorRoutes = require("./routes/inspector.routes");
const assetHealthRoutes = require("./routes/assetHealth.routes");
const deliveryRoutes = require("./routes/delivery.routes");
const maintenanceRoutes = require("./routes/maintenance.routes");

const app = express();

app.use(cors());
app.use(express.json());

// API Routes Mounting
app.use("/api/auth", authRoutes);
app.use("/api/asset", assetRouter);
app.use("/api/assetCategory", assetCategoryRouter);
app.use("/api/company", companyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/waiting-list", waitingListRoutes);
app.use("/api/negotiation", negotiationRoutes);
app.use("/api/final-inspection", finalInspection);
app.use("/api/damage-report", damageReport);
app.use("/api/contracts", contractRoutes);
app.use("/api/escrow", escrowRoutes); 
app.use("/api/inspection", inspectionRoutes);
app.use("/api/rental-completion", rentalCompletionRoutes);
app.use("/api/company-dashboard", companyDashboardRoutes);
app.use("/api/revenue-reports", revenueReportRoutes);
app.use("/api/penalty", penaltyRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/asset-lifecycle", assetLifecycle); 
app.use("/api/inspector", inspectorRoutes);
app.use("/api/assetHealth", assetHealthRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/maintenances", maintenanceRoutes);

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis(); 

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running successfully on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

module.exports = app;