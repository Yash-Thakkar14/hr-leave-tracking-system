import express from "express";
import cors from "cors";
import serverless from "serverless-http";

import connectDB from "./db/db.js";
import authRouter from "./routes/auth.js";
import departmentRouter from "./routes/department.js";
import employeeRouter from "./routes/employee.js";
import leaveRouter from "./routes/leave.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/leaves", leaveRouter);

app.get("/", (req, res) => res.json({ message: "HR LTS API Running ✅" }));

// ── Local dev: start the HTTP server directly ──────────────────────────────
// ── Vercel / serverless: export the handler instead ───────────────────────
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`),
    );
  });
}

export default serverless(app);
