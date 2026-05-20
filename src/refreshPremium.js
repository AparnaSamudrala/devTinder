/**
 * refreshPremium.js
 *
 * Utility script for database maintenance.
 * -------------------------------------------------
 * This script resets all users to non-premium, then
 * re-applies the premium flag ONLY for users who
 * have a valid Payment record with status "captured".
 *
 * Usage:
 *   node src/refreshPremium.js
 *
 * Notes:
 * - Not linked to production logic; runs manually.
 * - Safe to commit if you want it available in forks/clones.
 * - Keep in a /scripts folder or add to .gitignore if you
 *   prefer it excluded from deployments.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const Payment = require("./models/payment");

async function run() {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);

  // Step 1: Reset all users
  await User.updateMany({}, { isPremium: false, membershipType: null });
  console.log("All users reset to non-premium");

  // Step 2: Find successful payments
  const successfulPayments = await Payment.find({ status: "captured" });

  for (const payment of successfulPayments) {
    await User.findByIdAndUpdate(payment.userId, {
      isPremium: true,
      membershipType: payment.notes.membershipType,
    });
    console.log("Upgraded user:", payment.userId);
  }

  await mongoose.disconnect();
  console.log("Premium flags refreshed based on Payment collection");
}

run().catch((err) => console.error(err));
