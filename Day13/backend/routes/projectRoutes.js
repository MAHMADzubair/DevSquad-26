import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  createProject,
  getProjects,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.delete("/:id", authMiddleware, deleteProject);

export default router;
