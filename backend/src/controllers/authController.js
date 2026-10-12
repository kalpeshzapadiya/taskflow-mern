const User = require("../models/User");
const Organization = require("../models/Organization");
const Session = require("../models/Session");
const jwt = require("jsonwebtoken");

const accessExpiry = () => process.env.JWT_ACCESS_EXPIRY || "15m";
const refreshExpiry = () => process.env.JWT_REFRESH_EXPIRY || "7d";
const signAccessToken = (user) => jwt.sign({ id: user._id.toString() }, process.env.JWT_ACCESS_SECRET, { expiresIn: accessExpiry() });
const signRefreshToken = (user) => jwt.sign({ id: user._id.toString() }, process.env.JWT_REFRESH_SECRET, { expiresIn: refreshExpiry() });
const refreshExpiresAt = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
const setRefreshCookie = (res, token) => res.cookie("refreshToken", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/api/v1/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
const readCookie = (req, name) => {
  const raw = req.headers.cookie || "";
  const item = raw.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : null;
};

exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body || {};
    if (!fullName?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ success: false, message: "Full name, email, and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({ fullName: fullName.trim(), email: normalizedEmail, password });
    const org = await Organization.create({
      name: `${fullName.trim().split(/\s+/)[0]}'s Workspace`,
      slug: `${normalizedEmail.split("@")[0].replace(/[^a-z0-9-]/g, "-")}-workspace-${Date.now()}`,
      plan: "Free",
      memberships: [{ user: user._id, role: "OrgAdmin", status: "Active" }],
    });
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    await Session.create({ user: user._id, refreshToken, expiresAt: refreshExpiresAt() });
    setRefreshCookie(res, refreshToken);
    return res.status(201).json({
      success: true, accessToken,
      user: { id: user._id, fullName: user.fullName, email: user.email },
      currentOrgId: org._id,
    });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ success: false, message: "Email already registered" });
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const org = await Organization.findOne({ "memberships.user": user._id, "memberships.status": "Active" });
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    await Session.create({ user: user._id, refreshToken, expiresAt: refreshExpiresAt() });
    setRefreshCookie(res, refreshToken);
    return res.json({ success: true, accessToken, user: { id: user._id, fullName: user.fullName, email: user.email }, currentOrgId: org?._id || null });
  } catch (err) { return next(err); }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const token = readCookie(req, "refreshToken") || req.body?.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: "Refresh token is required" });
    let decoded;
    try { decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET); }
    catch { return res.status(401).json({ success: false, message: "Refresh token is invalid or expired" }); }
    const session = await Session.findOne({ user: decoded.id, refreshToken: token, expiresAt: { $gt: new Date() } });
    if (!session) return res.status(401).json({ success: false, message: "Session is no longer valid" });
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "User no longer exists" });
    const newRefreshToken = signRefreshToken(user);
    session.refreshToken = newRefreshToken;
    session.expiresAt = refreshExpiresAt();
    await session.save();
    setRefreshCookie(res, newRefreshToken);
    return res.json({ success: true, accessToken: signAccessToken(user) });
  } catch (err) { return next(err); }
};

exports.logout = async (req, res, next) => {
  try {
    const token = readCookie(req, "refreshToken") || req.body?.refreshToken;
    if (token) await Session.deleteOne({ refreshToken: token });
    res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/api/v1/auth" });
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (err) { return next(err); }
};


exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("fullName email avatar createdAt");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, user });
  } catch (error) { return next(error); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const fullName = req.body?.fullName;
    const email = req.body?.email;
    if (!fullName?.trim() || !email?.trim()) {
      return res.status(400).json({ success: false, message: "Full name and email are required" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: req.user.id } });
    if (existing) return res.status(409).json({ success: false, message: "Email is already in use" });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { fullName: fullName.trim(), email: normalizedEmail } },
      { new: true, runValidators: true, select: "fullName email avatar createdAt" }
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) { return next(error); }
};
