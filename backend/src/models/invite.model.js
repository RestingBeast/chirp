import mongoose from "mongoose";
import { nanoid } from "nanoid";

const inviteSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(12), // 12 chars is usually plenty for this scale
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: false, // Optional if you haven't implemented teams yet
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    used: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      // Default to 48 hours from now
      default: () => new Date(Date.now() + 48 * 60 * 60 * 1000),
    },
  },
  { timestamps: true },
);

// Index to automatically delete expired documents
// MongoDB checks this roughly every minute
inviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Invite = mongoose.model("Invite", inviteSchema);

export default Invite;
