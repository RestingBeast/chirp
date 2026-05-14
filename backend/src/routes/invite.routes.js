import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { protect, requireRole } from "../middlewares/auth.js";
import { createInviteSchema } from "../schemas/invite.schema.js";
import { createInvite } from "../controllers/invite.controller.js";

const router = Router();

// POST /invite/create
router.post(
  "/create",
  protect,
  requireRole("admin"),
  validate(createInviteSchema),
  createInvite,
);

export default router;
