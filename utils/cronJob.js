const cron = require('node-cron');
const User = require('../models/userModel');

// ✅ Run cron job every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('⏰ Running daily plan expiration check...');

  const now = new Date();

  // ✅ Find all users whose plans have expired
  const expiredUsers = await User.find({
    'plan.endDate': { $lte: now },
    'plan.planId': { $ne: null },
  });

  if (expiredUsers.length === 0) {
    console.log('✅ No expired plans found.');
    return;
  }

  // ✅ Remove plans from expired users
  for (const user of expiredUsers) {
    user.plan = {
      planId: null,
      planType: null,
      startDate: null,
      endDate: null,
    };
    user.status = 'Pending';

    // ✅ Save updated user status
    await user.save();
    console.log(`✅ Plan removed for user: ${user.name}`);
  }

  console.log('🎉 Plan expiration check completed successfully!');
});

module.exports = cron;
