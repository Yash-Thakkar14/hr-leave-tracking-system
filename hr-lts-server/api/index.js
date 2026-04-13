import express from "express";
import cors from "cors";
import serverless from "serverless-http";

import connectDB from "../db/db.js";
import authRouter from "../routes/auth.js";
import departmentRouter from "../routes/department.js";
import employeeRouter from "../routes/employee.js";
import leaveRouter from "../routes/leave.js";

const app = express();

connectDB();

app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/leaves", leaveRouter);

app.get("/", (req, res) => res.json({ message: "HR LTS API Running ✅" }));

export default serverless(app);
