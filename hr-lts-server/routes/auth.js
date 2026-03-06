import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import LeaveBalance from '../models/LeaveBalance.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department, position } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: 'User already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name, email,
      password: hashedPassword,
      role: role || 'employee',
      department,
      position
    })

    if (user.role === 'employee') {
      await LeaveBalance.create({ employee: user._id })
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid email or password' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' })

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json(req.user)
})

export default router