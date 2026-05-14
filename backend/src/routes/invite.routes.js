import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { protect, requireRole } from "../middlewares/auth.js";
import { createInviteSchema } from "../schemas/invite.schema.js";
import {
  createInvite,
  validateInvite,
} from "../controllers/invite.controller.js";

const router = Router();

// POST /invite/create
router.post(
  "/create",
  protect,
  requireRole("admin"),
  validate(createInviteSchema),
  createInvite,
);

// GET /invite/:token
router.get("/:token", validateInvite);

export default router;
