import { Router } from "express";
import {
  applyLeave,
  updateLeaveStatus,
  getLeaveBalance,
  getAllLeaves,
  getMyLeaves
} from "../controllers/leave.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/apply", authenticate, applyLeave);
router.post("/update", authenticate, updateLeaveStatus);
router.get("/balance", authenticate, getLeaveBalance);
router.get("/all", authenticate, getAllLeaves);
router.post("/update", authenticate, updateLeaveStatus);
router.get("/my", authenticate, getMyLeaves);

export default router;