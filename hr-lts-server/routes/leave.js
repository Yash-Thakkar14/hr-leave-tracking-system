import express from 'express'
import LeaveRequest from '../models/LeaveRequest.js'
import LeaveBalance from '../models/LeaveBalance.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

// POST /api/leave/apply
router.post('/apply', async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body

    const start = new Date(startDate)
    const end = new Date(endDate)
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1

    if (totalDays <= 0) {
      return res.status(400).json({ message: 'End date must be after start date' })
    }

    const balance = await LeaveBalance.findOne({ employee: req.user._id })
    if (!balance) return res.status(404).json({ message: 'Leave balance not found' })

    if (balance[leaveType]?.remaining < totalDays) {
      return res.status(400).json({ message: `Insufficient ${leaveType} leave balance` })
    }

    const leaveRequest = await LeaveRequest.create({
      employee: req.user._id,
      leaveType, startDate, endDate, totalDays, reason
    })

    res.status(201).json(leaveRequest)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/leave/my-leaves
router.get('/my-leaves', async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ employee: req.user._id })
      .sort({ createdAt: -1 })
    res.json(leaves)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/leave/balance
router.get('/balance', async (req, res) => {
  try {
    const balance = await LeaveBalance.findOne({ employee: req.user._id })
    if (!balance) return res.status(404).json({ message: 'Balance not found' })
    res.json(balance)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// DELETE /api/leave/:id
router.delete('/:id', async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id)
    if (!leave) return res.status(404).json({ message: 'Leave not found' })

    if (leave.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending leaves can be cancelled' })
    }

    await leave.deleteOne()
    res.json({ message: 'Leave request cancelled' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router