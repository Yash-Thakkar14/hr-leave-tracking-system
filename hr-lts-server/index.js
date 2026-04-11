import express from "express";
import cors from "cors";
import connectDB from "./db/db.js";
import authRouter from "./routes/auth.js";
import departmentRouter from "./routes/department.js";
import employeeRouter from "./routes/employee.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/employees", employeeRouter);
app.get("/", (req, res) => res.json({ message: "HR LTS API Running ✅" }));

app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
