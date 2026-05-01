import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import authRouter from "./routes/auth.js";
import departmentRouter from "./routes/department.js";
import employeeRouter from "./routes/employee.js";
import leaveRouter from "./routes/leave.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://hr-leave-tracking-system.vercel.app",
  /https:\/\/hr-leave-tracking-system.*\.vercel\.app$/,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = allowedOrigins.some((o) =>
        o instanceof RegExp ? o.test(origin) : o === origin,
      );
      callback(null, allowed);
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/leaves", leaveRouter);

app.get("/", (req, res) => res.json({ message: "HR LTS API Running ✅" }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
