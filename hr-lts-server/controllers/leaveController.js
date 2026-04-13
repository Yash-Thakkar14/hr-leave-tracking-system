import LeaveRequest from "../models/LeaveRequest.js";
import LeaveBalance from "../models/LeaveBalance.js";
import User from "../models/User.js";
import Department from "../models/Department.js";

// Calculates working days between two dates, excluding weekends
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

// Gets or creates a balance record for a user in a given year
const getOrCreateBalance = async (userId, year) => {
  let balance = await LeaveBalance.findOne({ employee: userId, year });
  if (!balance) {
    balance = await LeaveBalance.create({ employee: userId, year });
  }
  return balance;
};

// ── EMPLOYEE: Apply for leave ─────────────────────────────────────────────────
// POST /api/leaves/apply
export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const userId = req.user._id;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({
        success: false,
        error: "End date cannot be before start date",
      });
    }

    const totalDays = calcWorkingDays(start, end);
    if (totalDays === 0) {
      return res.status(400).json({
        success: false,
        error: "Leave must cover at least one working day",
      });
    }

    // Check balance for capped leave types
    // NOTE: unpaid is intentionally uncapped (total = 999) but still tracked
    const capped = ["sick", "casual", "annual", "unpaid"];
    if (capped.includes(leaveType)) {
      const year = start.getFullYear();
      const balance = await getOrCreateBalance(userId, year);
      const pool = balance[leaveType];

      // Also account for already-pending leaves of same type so users can't
      // double-book beyond their allowance before admin approves.
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

      if (leaveType !== "unpaid" && totalDays > remaining) {
        return res.status(400).json({
          success: false,
          error: `Insufficient ${leaveType} leave balance. You have ${remaining} day(s) remaining (including pending requests).`,
        });
      }
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

// ── EMPLOYEE: Get own leave history ──────────────────────────────────────────
// GET /api/leaves/my-leaves
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

// ── EMPLOYEE: Get own leave balance ──────────────────────────────────────────
// GET /api/leaves/my-balance
export const getMyBalance = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const balance = await getOrCreateBalance(req.user._id, year);
    return res.status(200).json({ success: true, balance });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ── ADMIN: Get all leave requests ────────────────────────────────────────────
// GET /api/leaves
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

// ── ADMIN: Approve or reject a leave request ─────────────────────────────────
// PUT /api/leaves/:id/status
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, error: "Status must be approved or rejected" });
    }

    const leave = await LeaveRequest.findById(id);
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, error: "Leave request not found" });
    }

    if (leave.status !== "pending") {
      return res
        .status(400)
        .json({
          success: false,
          error: "This request has already been reviewed",
        });
    }

    // ── FIX: Deduct balance atomically using $inc so Mongoose dirty-checking
    //    doesn't silently skip the nested-object update (root cause of the
    //    balance "resetting to 10" bug).
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

// ── ADMIN: Dashboard summary counts ─────────────────────────────────────────
// GET /api/leaves/summary
export const getLeaveSummary = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: "employee" });
    const totalDepartments = await Department.countDocuments();
    const totalLeaves = await LeaveRequest.countDocuments();
    const approved = await LeaveRequest.countDocuments({ status: "approved" });
    const pending = await LeaveRequest.countDocuments({ status: "pending" });
    const rejected = await LeaveRequest.countDocuments({ status: "rejected" });

    return res.status(200).json({
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
