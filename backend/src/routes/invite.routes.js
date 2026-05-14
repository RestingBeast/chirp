import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { protect, requireRole } from "../middlewares/auth.js";
import { createInviteSchema } from "../schemas/invite.schema.js";
import {
  createInvite,
  validateInvite,
} from "../controllers/invite.controller.js";

const router = Router();

/**
 * @route   POST /api/invites/create
 * @desc
 * @access  Private
 */
router.post(
  "/create",
  protect,
  requireRole("admin"),
  validate(createInviteSchema),
  createInvite,
);

/**
 * @route   GET /api/invites/:token
 * @desc
 * @access  Public
 */
router.get("/:token", validateInvite);

export default router;
