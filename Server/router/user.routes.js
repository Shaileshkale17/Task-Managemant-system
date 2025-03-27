import express from "express";
import {
  OneuserFech,
  User_Deleted,
  createUser,
  userFetch,
  loginUser,
  updateUser,
} from "../controllers/User.Controller.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.get("/", protect, userFetch);
router.get("/:id", protect, OneuserFech);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, User_Deleted);

export default router;
