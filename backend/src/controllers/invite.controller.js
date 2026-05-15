import Invite from "../models/invite.model.js";

// ─── POST /invites/create (Admin Only) ───────────────────────────────────────
// Body: { email, role?, teamId? }
export async function createInvite(req, res) {
  try {
    const { email, role, teamId } = req.body;

    // Optional: Check if an active invite already exists for this email
    const existingInvite = await Invite.findOne({
      email: email.toLowerCase(),
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (existingInvite) {
      return res.status(400).json({
        success: false,
        message: "An active invite already exists for this email.",
      });
    }

    // Create the invite
    // The nanoid token and default expiresAt are handled by the model
    const invite = await Invite.create({
      email: email.toLowerCase(),
      role: role || "member",
      teamId: teamId || null,
    });

    // Construct the join link for the admin to copy
    // Note: FRONTEND_URL should be your Next.js address (e.g., http://localhost:3000)
    const baseURL = process.env.FRONTEND_URL ?? "http://localhost:3000";
    const joinLink = `${baseURL}/join?token=${invite.token}`;

    return res.status(201).json({
      success: true,
      message: "Invite generated successfully",
      data: {
        email: invite.email,
        token: invite.token,
        expiresAt: invite.expiresAt,
        joinLink,
      },
    });
  } catch (err) {
    console.error("[createInvite]", err);
    return res.status(500).json({
      success: false,
      message: "Failed to generate invite.",
    });
  }
}

// ─── GET /invites/:token (Public) ───────────────────────────────────────────
// Used by the /join page to validate the token and pre-fill the email
export async function validateInvite(req, res) {
  try {
    const { token } = req.params;

    const invite = await Invite.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!invite) {
      return res.status(404).json({
        success: false,
        message: "Invite link is invalid or has expired.",
      });
    }

    return res.status(200).json({
      success: true,
      email: invite.email,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error validating invite.",
    });
  }
}
