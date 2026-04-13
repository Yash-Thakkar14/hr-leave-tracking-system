import mongoose from "mongoose";

const leaveBalanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
    sick: {
      total: { type: Number, default: 10 },
      used: { type: Number, default: 0 },
    },
    casual: {
      total: { type: Number, default: 12 },
      used: { type: Number, default: 0 },
    },
    annual: {
      total: { type: Number, default: 15 },
      used: { type: Number, default: 0 },
    },
    unpaid: {
      total: { type: Number, default: 999 },
      used: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

leaveBalanceSchema.index({ employee: 1, year: 1 }, { unique: true });

const LeaveBalance = mongoose.model("LeaveBalance", leaveBalanceSchema);
export default LeaveBalance;
