const Task = require("../models/Task");
const mongoose = require("mongoose");

exports.getOrganizationAnalytics = async (req, res, next) => {
  try {
    const orgIdHeader = req.headers["x-organization-id"];
    if (!orgIdHeader) {
      return res
        .status(400)
        .json({ success: false, message: "Organization header is missing" });
    }
    const orgId = new mongoose.Types.ObjectId(orgIdHeader);

    const stats = await Task.aggregate([
      { $match: { organization: orgId, isDeleted: false } },
      {
        $facet: {
          taskStatusCounts: [
            { $group: { _id: "$status", count: { $sum: 1 } } },
          ],
          overdueTasks: [
            {
              $match: {
                dueDate: { $lt: new Date() },
                status: { $ne: "Done" },
              },
            },
            { $count: "total" },
          ],
          workloadPerAssignee: [
            { $group: { _id: "$assignee", totalTasks: { $sum: 1 } } },
            {
              $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "userInfo",
              },
            },
            {
              $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true },
            },
            { $project: { name: "$userInfo.fullName", totalTasks: 1 } },
          ],
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats[0],
    });
  } catch (err) {
    next(err);
  }
};
