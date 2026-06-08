import express from "express";
import {
  submitStandup,
  getTeamStandups,
  generateTeamDigest,
} from "../controllers/standup.controller.js";
import { protect, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createStandupSchema } from "../schemas/standup.schema.js";
import { generateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

/**
 * @route   POST /api/standups
 * @desc
 * @access  Private
 */
router.post("/", protect, validate(createStandupSchema), submitStandup);

/**
 * @route   GET /api/standups/team/:teamId
 * @desc
 * @access  Private
 */
router.get("/teams/:teamId", protect, getTeamStandups);

/**
 * @route   GET /api/standups/team/:teamId
 * @desc
 * @access  Private
 */
router.post(
  "/digest",
  protect,
  requireRole("admin"),
  generateLimiter,
  generateTeamDigest,
);

export default router;
