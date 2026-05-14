import express from "express";
import {
  submitStandup,
  getTeamStandups,
} from "../controllers/standup.controller.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createStandupSchema } from "../schemas/standup.schema.js";

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
router.get("/team/:teamId", protect, getTeamStandups);

export default router;
