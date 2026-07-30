const cron = require('node-cron');
const Asset = require('../models/asset.model');

/**
 * Starts all application cron jobs
 */
const startCronJobs = () => {
  // Run daily at midnight: '0 0 * * *'
  // For testing purposes, you can change it to '* * * * *' (every minute)
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily maintenance check job...');
    try {
      const today = new Date();
      // Set to start of day for accurate comparison
      today.setHours(0, 0, 0, 0);

      // Find assets due for maintenance today or earlier that aren't already in Maintenance
      const assetsDue = await Asset.find({
        nextMaintenanceDate: { $lte: today },
        status: { $ne: 'Maintenance' }
      });

      if (assetsDue.length > 0) {
        console.log(`Found ${assetsDue.length} assets due for maintenance.`);
        
        for (const asset of assetsDue) {
          asset.status = 'Maintenance';
          await asset.save();
          console.log(`Updated asset ${asset.assetCode} status to Maintenance`);
        }
        
      } else {
        console.log('No assets due for maintenance today.');
      }
    } catch (error) {
      console.error('Error running daily maintenance check job:', error);
    }
  });
  
  console.log('Cron jobs scheduled successfully');
};

module.exports = {
  startCronJobs
};
