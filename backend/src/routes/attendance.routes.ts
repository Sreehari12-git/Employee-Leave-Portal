import { Router } from "express";
import {
  clockIn,
  clockOut,
  getTodayStatus,
   getMyAttendance,  
  getAllAttendance,  
  getTeamStatus,
} from "../controllers/attendance.controller";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";

const router = Router();

router.post("/clock-in", authenticate, clockIn);
router.post("/clock-out", authenticate, clockOut);
router.get("/today", authenticate, getTodayStatus);
router.get("/my", authenticate, getMyAttendance);   
router.get("/all", authenticate, isAdmin, getAllAttendance); 
router.get("/team", authenticate, isAdmin, getTeamStatus);
export default router;