import express from "express";
import authMiddleware from "../middleware/auth.js";

import {
  addMember,
  getMembers,
  deleteMember,
} from "../controllers/memberController.js";

const router = express.Router();

router.post("/", authMiddleware, addMember);
router.get("/", authMiddleware, getMembers);
router.delete("/:id", authMiddleware, deleteMember);

export default router;
