import mongoose from "mongoose";

const standupSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    // Storing the date as a string (YYYY-MM-DD) simplifies "today" lookups
    // across different timezones compared to full ISODates.
    date: {
      type: String,
      required: true,
    },
    yesterday: {
      type: String,
      required: true,
      trim: true,
    },
    today: {
      type: String,
      required: true,
      trim: true,
    },
    blockers: {
      type: String,
      required: false,
      default: "None",
      trim: true,
    },
  },
  { timestamps: true },
);

// CRITICAL: Prevents duplicate entries for the same user on the same day.
standupSchema.index({ userId: 1, date: 1 }, { unique: true });

// Helps with Phase 3, Step 12: Fetching team standups for a specific day.
standupSchema.index({ teamId: 1, date: 1 });

const Standup = mongoose.model("Standup", standupSchema);

export default Standup;
