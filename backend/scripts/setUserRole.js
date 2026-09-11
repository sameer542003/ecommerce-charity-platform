/**
 * One-off CLI helper to promote a user to admin/super-admin.
 *
 * Registration always creates a plain "user" account (by design — letting
 * the client set their own role at sign-up is a privilege-escalation bug).
 * Use this script to promote the first admin/super-admin from the command
 * line, e.g. after you've registered your own account normally:
 *
 *   node scripts/setUserRole.js you@example.com admin
 *   node scripts/setUserRole.js you@example.com super-admin
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user");

const [, , emailOrMobile, role] = process.argv;

if (!emailOrMobile || !["admin", "super-admin", "user"].includes(role)) {
  console.log("Usage: node scripts/setUserRole.js <email-or-mobile> <user|admin|super-admin>");
  process.exit(1);
}

(async () => {
  await mongoose.connect(process.env.URL);
  const user = await User.findOneAndUpdate(
    { $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }] },
    { role },
    { new: true }
  );
  if (!user) {
    console.log("No user found with that email/mobile. Register the account first.");
  } else {
    console.log(`Updated ${user.email} → role: ${user.role}`);
  }
  await mongoose.disconnect();
})();
