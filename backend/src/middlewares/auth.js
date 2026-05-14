import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// ─── protect ─────────────────────────────────────────────────────────────────
// Attaches decoded JWT payload to req.user on success.
// Usage: router.get("/protected", protect, handler)
export function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded = { sub: userId, email, role, iat, exp }
    req.user = decoded;
    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";

    return res.status(401).json({
      success: false,
      message,
    });
  }
}

// ─── requireRole ──────────────────────────────────────────────────────────────
// Role-based guard. Always use AFTER protect.
// Usage: router.post("/invites", protect, requireRole("admin"), handler)
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
}
