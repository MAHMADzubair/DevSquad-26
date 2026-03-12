import express from "express";
import {
  createTask,
  getTasks,
  getMyTasks,
  updateTaskStatus,
} from "../controllers/taskController.js";

import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.get("/my", authMiddleware, getMyTasks);
router.put("/:id", authMiddleware, updateTaskStatus);

export default router;
