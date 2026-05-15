import { Router } from "express";
import { protect, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  assignUserToTeam,
  getAllUsers,
} from "../controllers/user.controller.js";
import { assignUserSchema } from "../schemas/user.schema.js";

const router = Router();

/**
 * @route   GET /api/users
 * @desc
 * @access  Private
 */
router.get("/", protect, requireRole("admin"), getAllUsers);

/**
 * @route   PUT /api/users/assign
 * @desc
 * @access  Private
 */
router.put(
  "/assign",
  protect,
  requireRole("admin"),
  validate(assignUserSchema),
  assignUserToTeam,
);

export default router;
