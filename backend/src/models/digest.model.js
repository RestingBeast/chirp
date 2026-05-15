import mongoose from "mongoose";

const digestSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  summary: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now },
});

// Ensure only one digest exists per team per day
digestSchema.index({ teamId: 1, date: 1 }, { unique: true });

const Digest = mongoose.model("Digest", digestSchema);

export default Digest;
