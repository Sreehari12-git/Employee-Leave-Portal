import { Router } from "express";
import { getDashboard } from "../controllers/admin.controller";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";
import { createUser } from "../controllers/admin.controller";

const router = Router();

router.get("/dashboard", authenticate, getDashboard);
router.post("/create-user", authenticate, isAdmin, createUser);

export default router;