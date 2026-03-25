import { Router } from "express";
import {
  clockIn,
  clockOut,
  getTodayStatus,
} from "../controllers/attendance.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/clock-in", authenticate, clockIn);
router.post("/clock-out", authenticate, clockOut);
router.get("/today", authenticate, getTodayStatus);

export default router;