require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/User");
const Organization = require("../src/models/Organization");

async function seed() {
  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/multitenant_workflow",
  );
  await User.deleteMany({});
  await Organization.deleteMany({});

  const admin = await User.create({
    fullName: "Super Admin",
    email: "admin@taskflow.com",
    password: "Password123!",
    isEmailVerified: true,
  });

  await Organization.create({
    name: "Acme Corp",
    slug: "acme-corp",
    plan: "Enterprise",
    memberships: [{ user: admin._id, role: "OrgAdmin", status: "Active" }],
  });

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
