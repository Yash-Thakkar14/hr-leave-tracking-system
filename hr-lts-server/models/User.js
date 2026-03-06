import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['employee', 'admin'],
    default: 'employee'
  },
  department: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: ''
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)
export default User