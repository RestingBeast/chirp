import { Router } from "express";
import { protect, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  assignUserToTeam,
  getAllUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { assignUserSchema, updateUserSchema } from "../schemas/user.schema.js";

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

/**
 * @route   PATCH /api/users/:id
 * @desc    Update user name and/or password
 * @access  Private/Admin
 */
router.patch(
  "/:id",
  protect,
  requireRole("admin"),
  validate(updateUserSchema),
  updateUser,
);

export default router;
