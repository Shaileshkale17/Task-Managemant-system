import express from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  getTaskById,
  updateTask,
} from "../controllers/Task.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.get("/:id", protect, getTaskById);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
export default router;
