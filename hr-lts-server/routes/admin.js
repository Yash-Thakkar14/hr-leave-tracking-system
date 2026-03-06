import express from 'express'
import LeaveRequest from '../models/LeaveRequest.js'
import LeaveBalance from '../models/LeaveBalance.js'
import User from '../models/User.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.use(protect, adminOnly)

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const [totalEmployees, pendingLeaves, approvedLeaves, rejectedLeaves] = await Promise.all([
      User.countDocuments({ role: 'employee' }),
      LeaveRequest.countDocuments({ status: 'pending' }),
      LeaveRequest.countDocuments({ status: 'approved' }),
      LeaveRequest.countDocuments({ status: 'rejected' })
    ])

    const recentRequests = await LeaveRequest.find({ status: 'pending' })
      .populate('employee', 'name department')
      .sort({ createdAt: -1 })
      .limit(5)

    res.json({
      stats: { totalEmployees, pendingLeaves, approvedLeaves, rejectedLeaves },
      recentRequests
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/admin/leaves
router.get('/leaves', async (req, res) => {
  try {
    const { status } = req.query
    const filter = status ? { status } : {}

    const leaves = await LeaveRequest.find(filter)
      .populate('employee', 'name email department position')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })

    res.json(leaves)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// PUT /api/admin/leaves/:id
router.put('/leaves/:id', async (req, res) => {
  try {
    const { status, adminComment } = req.body

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' })
    }

    const leave = await LeaveRequest.findById(req.params.id)
    if (!leave) return res.status(404).json({ message: 'Leave not found' })
    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Leave already reviewed' })
    }

    leave.status = status
    leave.adminComment = adminComment || ''
    leave.reviewedBy = req.user._id
    leave.reviewedAt = new Date()
    await leave.save()

    if (status === 'approved') {
      const balance = await LeaveBalance.findOne({ employee: leave.employee })
      if (balance && balance[leave.leaveType]) {
        balance[leave.leaveType].used += leave.totalDays
        balance[leave.leaveType].remaining -= leave.totalDays
        await balance.save()
      }
    }

    const updated = await LeaveRequest.findById(req.params.id)
      .populate('employee', 'name email department')

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/admin/employees
router.get('/employees', async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .select('-password')
      .sort({ createdAt: -1 })
    res.json(employees)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// PUT /api/admin/employees/:id/balance
router.put('/employees/:id/balance', async (req, res) => {
  try {
    const { leaveType, total } = req.body
    const balance = await LeaveBalance.findOne({ employee: req.params.id })
    if (!balance) return res.status(404).json({ message: 'Balance not found' })

    balance[leaveType].total = total
    balance[leaveType].remaining = total - balance[leaveType].used
    await balance.save()

    res.json(balance)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router