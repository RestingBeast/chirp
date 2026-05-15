import express from "express";
import {
  createTeam,
  getMyTeams,
  deleteEmptyTeam,
} from "../controllers/team.controller.js";
import { protect, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createTeamSchema } from "../schemas/team.schema.js";

const router = express.Router();

/**
 * @route   POST /api/teams
 * @desc    Create a new team (Admin Only)
 * @access  Private/Admin
 */
router.post(
  "/",
  protect,
  requireRole("admin"),
  validate(createTeamSchema), //
  createTeam,
);

/**
 * @route   GET /api/teams
 * @desc
 * @access  Private
 */
router.get("/", protect, requireRole("admin"), getMyTeams);

/**
 * @route   DELETE /api/teams/:teamId
 * @desc
 * @access  Private
 */
router.delete("/:teamId", protect, requireRole("admin"), deleteEmptyTeam);

export default router;
