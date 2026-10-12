const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: {
    type: String,
    enum: ["SuperAdmin", "OrgAdmin", "ProjectManager", "TeamMember", "Viewer"],
    default: "TeamMember",
  },
  status: { type: String, enum: ["Active", "Suspended"], default: "Active" },
});

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ["Free", "Pro", "Enterprise"],
      default: "Free",
    },
    memberships: [membershipSchema],
  },
  { timestamps: true },
);

organizationSchema.index({ "memberships.user": 1, "memberships.role": 1 });

module.exports = mongoose.model("Organization", organizationSchema);
