import LeaveRequest from "../models/LeaveRequest.js";
import LeaveBalance from "../models/LeaveBalance.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Department from "../models/Department.js";

const calcWorkingDays = (start, end) => {
  let count = 0;
  const cur = new Date(start);
  const endDate = new Date(end);
  while (cur <= endDate) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
};

const getOrCreateBalance = async (userId, year) => {
  let balance = await LeaveBalance.findOne({ employee: userId, year });
  if (!balance) balance = await LeaveBalance.create({ employee: userId, year });
  return balance;
};

export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const userId = req.user._id;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start)
      return res
        .status(400)
        .json({
          success: false,
          error: "End date cannot be before start date",
        });
    const totalDays = calcWorkingDays(start, end);
    if (totalDays === 0)
      return res
        .status(400)
        .json({
          success: false,
          error: "Leave must cover at least one working day",
        });
    const capped = ["sick", "casual", "annual", "unpaid"];
    if (capped.includes(leaveType)) {
      const year = start.getFullYear();
      const balance = await getOrCreateBalance(userId, year);
      const pool = balance[leaveType];
      const pendingDays = await LeaveRequest.aggregate([
        {
          $match: {
            employee: userId,
            leaveType,
            status: "pending",
            startDate: { $gte: new Date(`${year}-01-01`) },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalDays" } } },
      ]);
      const alreadyPending = pendingDays[0]?.total || 0;
      const remaining = pool.total - pool.used - alreadyPending;
      if (leaveType !== "unpaid" && totalDays > remaining)
        return res
          .status(400)
          .json({
            success: false,
            error: `Insufficient ${leaveType} leave balance. You have ${remaining} day(s) remaining.`,
          });
    }
    const leave = await LeaveRequest.create({
      employee: userId,
      leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason,
      status: "pending",
    });
    return res.status(201).json({ success: true, leave });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ employee: req.user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getMyBalance = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const balance = await getOrCreateBalance(req.user._id, year);
    return res.status(200).json({ success: true, balance });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find()
      .populate("employee", "name email")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getEmployeeLeaves = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employeeDoc = await Employee.findById(employeeId);
    if (!employeeDoc)
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    const userId = employeeDoc.userId;
    const [leaves, balance] = await Promise.all([
      LeaveRequest.find({ employee: userId }).sort({ createdAt: -1 }),
      getOrCreateBalance(userId, new Date().getFullYear()),
    ]);
    return res.status(200).json({ success: true, leaves, balance });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;
    if (!["approved", "rejected"].includes(status))
      return res
        .status(400)
        .json({ success: false, error: "Status must be approved or rejected" });
    const leave = await LeaveRequest.findById(id);
    if (!leave)
      return res
        .status(404)
        .json({ success: false, error: "Leave request not found" });
    if (leave.status !== "pending")
      return res
        .status(400)
        .json({
          success: false,
          error: "This request has already been reviewed",
        });
    if (status === "approved") {
      const capped = ["sick", "casual", "annual", "unpaid"];
      if (capped.includes(leave.leaveType)) {
        const year = new Date(leave.startDate).getFullYear();
        await LeaveBalance.findOneAndUpdate(
          { employee: leave.employee, year },
          { $inc: { [`${leave.leaveType}.used`]: leave.totalDays } },
          { upsert: true, new: true },
        );
      }
    }
    leave.status = status;
    leave.adminComment = adminComment || "";
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = new Date();
    await leave.save();
    return res.status(200).json({ success: true, leave });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getLeaveSummary = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: "employee" });
    const totalDepartments = await Department.countDocuments();
    const totalLeaves = await LeaveRequest.countDocuments();
    const approved = await LeaveRequest.countDocuments({ status: "approved" });
    const pending = await LeaveRequest.countDocuments({ status: "pending" });
    const rejected = await LeaveRequest.countDocuments({ status: "rejected" });
    return res
      .status(200)
      .json({
        success: true,
        summary: {
          totalEmployees,
          totalDepartments,
          totalLeaves,
          approved,
          pending,
          rejected,
        },
      });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
