import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const ms = (val) => {
  const unit = val.slice(-1);
  const num = parseInt(val);
  if (unit === "d") return num * 24 * 60 * 60 * 1000;
  if (unit === "h") return num * 60 * 60 * 1000;
  return 3600000; // Default 1h
};

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function sendTokenResponse(res, user, statusCode = 200) {
  const token = signToken({
    sub: user._id,
    email: user.email,
    role: user.role,
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: user.toSafeObject(),
  });
}

// ─── POST /auth/register ─────────────────────────────────────────────────────
// Body: { name, email, password, inviteToken? }
// Phase 1: open registration. Phase 2: wire in invite token validation here.

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Duplicate email check — Mongo unique index will also catch this,
    // but checking explicitly gives a cleaner error message.
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with that email already exists",
      });
    }

    // Store raw password in passwordHash field —
    // the pre-save hook hashes it before writing to Mongo.
    const user = await User.create({
      name,
      email,
      passwordHash: password,
    });

    return sendTokenResponse(res, user, 201);
  } catch (err) {
    console.error("[register]", err);
    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
}

// ─── POST /auth/login ────────────────────────────────────────────────────────
// Body: { email, password }

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // passwordHash is select: false — must opt back in explicitly
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+passwordHash",
    );

    if (!user) {
      // Same message for missing user AND wrong password — prevents enumeration
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return sendTokenResponse(res, user);
  } catch (err) {
    console.error("[login]", err);
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
}

// ─── POST /auth/logout ────────────────────────────────────────────────────────
export async function logout(req, res) {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}
