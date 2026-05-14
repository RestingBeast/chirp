import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { validate } from "../middlewares/validate.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc
 * @access  Private
 */
router.post("/register", validate(registerSchema), register);

/**
 * @route   POST /api/auth/login
 * @desc
 * @access  Private
 */
router.post("/login", validate(loginSchema), login);

export default router;
