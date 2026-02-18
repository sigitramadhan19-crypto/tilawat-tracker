
import { Router } from "express";
import { goalController } from "../controllers/goalController";
import { readingController } from "../controllers/readingController";
import { progressController } from "../controllers/progressController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Goals
router.get("/goals", requireAuth, goalController.getGoal);
router.post("/goals", requireAuth, goalController.updateGoal); // Use POST for create/update logic

// Reading
router.post("/reading/log", requireAuth, readingController.logReading);
router.get("/reading/history", requireAuth, readingController.getHistory);

// Progress
router.get("/progress/stats", requireAuth, progressController.getStats);

export default router;
