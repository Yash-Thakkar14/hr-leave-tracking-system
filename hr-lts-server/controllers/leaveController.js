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
    // Re-fetch with populated employee so frontend name stays correct
    const populated = await LeaveRequest.findById(leave._id)
      .populate("employee", "name email")
      .populate("reviewedBy", "name");
    return res.status(200).json({ success: true, leave: populated });
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

// ── ER12: Bradford Factor report ──────────────────────────────────────────
// GET /api/leaves/reports/bradford
export const getBradfordReport = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31`);

    // Get all approved leaves for the year
    const leaves = await LeaveRequest.find({
      status: "approved",
      startDate: { $gte: start, $lte: end },
    }).populate("employee", "name email");

    // Group by employee userId
    const empMap = {};
    for (const leave of leaves) {
      const uid = leave.employee?._id?.toString();
      if (!uid) continue;
      if (!empMap[uid]) {
        empMap[uid] = {
          name: leave.employee.name || leave.employee.email,
          spells: 0,
          totalDays: 0,
        };
      }
      empMap[uid].spells += 1;
      empMap[uid].totalDays += leave.totalDays;
    }

    // Get department for each user via Employee model
    const report = [];
    for (const [userId, stats] of Object.entries(empMap)) {
      const empDoc = await Employee.findOne({ userId }).populate(
        "department",
        "dept_name",
      );
      const score = stats.spells * stats.spells * stats.totalDays;
      report.push({
        employeeId: userId,
        name: stats.name,
        department: empDoc?.department?.dept_name || "—",
        spells: stats.spells,
        totalDays: stats.totalDays,
        score,
      });
    }

    // Sort highest score first
    report.sort((a, b) => b.score - a.score);
    return res.status(200).json({ success: true, report });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ── ER13: Absence trend report ────────────────────────────────────────────
// GET /api/leaves/reports/trends
export const getAbsenceTrends = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31`);

    const leaves = await LeaveRequest.find({
      status: "approved",
      startDate: { $gte: start, $lte: end },
    });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const leaveTypes = [
      "sick",
      "casual",
      "annual",
      "unpaid",
      "maternity",
      "paternity",
    ];

    // Build monthly buckets
    const monthly = months.map((month) => ({ month }));
    leaveTypes.forEach((t) =>
      monthly.forEach((m) => {
        m[t] = 0;
      }),
    );

    for (const leave of leaves) {
      const m = new Date(leave.startDate).getMonth();
      if (monthly[m][leave.leaveType] !== undefined) {
        monthly[m][leave.leaveType] += leave.totalDays;
      }
    }

    // Summary totals per type
    const summary = {};
    leaveTypes.forEach((t) => {
      summary[t] = monthly.reduce((sum, m) => sum + (m[t] || 0), 0);
    });
    // Remove zero-total types from summary
    Object.keys(summary).forEach((k) => {
      if (summary[k] === 0) delete summary[k];
    });

    return res.status(200).json({ success: true, monthly, summary });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ── MR08: Absence pattern flagging ───────────────────────────────────────
// GET /api/leaves/reports/patterns
export const getAbsencePatterns = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const start = new Date(`${year}-01-01`);

    const leaves = await LeaveRequest.find({
      status: "approved",
      startDate: { $gte: start },
    }).populate("employee", "name email");

    // Group by employee
    const empMap = {};
    for (const leave of leaves) {
      const uid = leave.employee?._id?.toString();
      if (!uid) continue;
      if (!empMap[uid]) {
        empMap[uid] = {
          name: leave.employee.name || leave.employee.email,
          leaves: [],
        };
      }
      empMap[uid].leaves.push(leave);
    }

    const flags = [];

    for (const [userId, stats] of Object.entries(empMap)) {
      const empFlags = [];
      const details = [];
      const leaves = stats.leaves;
      const sickLeaves = leaves.filter((l) => l.leaveType === "sick");
      const totalDays = leaves.reduce((s, l) => s + l.totalDays, 0);

      // Flag 1: Monday/Friday sick pattern (≥2 occurrences)
      const monFriSick = sickLeaves.filter((l) => {
        const day = new Date(l.startDate).getDay();
        return day === 1 || day === 5; // Monday=1, Friday=5
      });
      if (monFriSick.length >= 2) {
        empFlags.push("Monday/Friday Pattern");
        details.push(
          `${monFriSick.length} sick leaves starting on Monday or Friday`,
        );
      }

      // Flag 2: Frequent short absences (≥4 separate spells of 1-2 days)
      const shortSpells = leaves.filter((l) => l.totalDays <= 2);
      if (shortSpells.length >= 4) {
        empFlags.push("Frequent Short Absences");
        details.push(`${shortSpells.length} absences of 1–2 days`);
      }

      // Flag 3: High sick leave (≥6 days sick in the year)
      const sickDays = sickLeaves.reduce((s, l) => s + l.totalDays, 0);
      if (sickDays >= 6) {
        empFlags.push("High Sick Leave Usage");
        details.push(`${sickDays} sick days taken this year`);
      }

      if (empFlags.length > 0) {
        const empDoc = await Employee.findOne({ userId }).populate(
          "department",
          "dept_name",
        );
        flags.push({
          employeeId: empDoc?._id?.toString() || userId,
          name: stats.name,
          department: empDoc?.department?.dept_name || "—",
          flags: empFlags,
          totalAbsences: leaves.length,
          totalDays,
          sickCount: sickLeaves.length,
          detail: details.join(" · "),
        });
      }
    }

    // Sort by number of flags descending
    flags.sort((a, b) => b.flags.length - a.flags.length);
    return res.status(200).json({ success: true, flags });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
