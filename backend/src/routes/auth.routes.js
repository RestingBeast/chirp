import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { validate } from "../middlewares/validate.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

// POST /auth/register
router.post("/register", validate(registerSchema), register);

// POST /auth/login
router.post("/login", validate(loginSchema), login);

// Remove Later
router.get("/test", protect, (req, res) => {
  res.send("Hello, World");
});

export default router;
