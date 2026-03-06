import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import leaveRoutes from './routes/leave.js'
import adminRoutes from './routes/admin.js'

connectDB()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/leave', leaveRoutes)
app.use('/api/admin', adminRoutes)

app.get('/', (req, res) => res.json({ message: 'HR LTS API Running ✅' }))

app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`)
})
