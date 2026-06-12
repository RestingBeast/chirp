import express from "express";
import {
  createTeam,
  getMyTeams,
  deleteEmptyTeam,
  getTeamMembers,
  renameTeam,
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
 * @route   PATCH /api/teams/:teamId
 * @desc
 * @access  Private
 */
router.patch(
  "/:teamId",
  protect,
  requireRole("admin"),
  validate(createTeamSchema),
  renameTeam,
);

/**
 * @route   DELETE /api/teams/:teamId
 * @desc
 * @access  Private
 */
router.delete("/:teamId", protect, requireRole("admin"), deleteEmptyTeam);

/**
 * @route   GET /api/teams/:teamId/member
 * @desc
 * @access  Private
 */
router.get("/:teamId/members", protect, getTeamMembers);

export default router;
