import express from "express";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import leaveRoutes from "./routes/leave.routes";
import attendanceRoutes from "./routes/attendance.routes";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});