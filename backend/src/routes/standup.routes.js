import express from "express";
import { submitStandup } from "../controllers/standup.controller.js";
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

export default router;
