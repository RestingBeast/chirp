import Standup from "../models/standup.model.js";
import Digest from "../models/digest.model.js";
import { createTeamDigest } from "../services/ai.service.js";

export async function submitStandup(req, res) {
  try {
    const { teamId, yesterday, today, blockers } = req.body;

    // Generate date string in Singapore time (YYYY-MM-DD)
    const todayDate = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Singapore", // Matches your current location
    });

    const standup = await Standup.create({
      userId: req.user.sub,
      teamId,
      date: todayDate,
      yesterday,
      today,
      blockers,
    });

    res.status(201).json({ success: true, data: standup });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted a standup for today.",
      });
    }
    res.status(500).json({ success: false, message: "Failed to save standup" });
  }
}

export async function getTeamStandups(req, res) {
  try {
    const { teamId } = req.params;

    // Default to Singapore today if no date is provided in query
    const date =
      req.query.date ||
      new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Singapore",
      });

    // 1. Run both queries in parallel for better performance
    const [standups, digest] = await Promise.all([
      Standup.find({ teamId, date })
        .populate("userId", "name email")
        .sort({ createdAt: 1 }),
      Digest.findOne({ teamId, date }),
    ]);

    res.json({
      success: true,
      date,
      count: standups.length,
      data: standups,
      digest: digest || null,
    });
  } catch (err) {
    console.error("[getTeamStandups]", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch team board" });
  }
}

export async function generateTeamDigest(req, res) {
  try {
    const { teamId } = req.body;
    const date = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Singapore",
    });

    // 1. Get all standups for this team today
    const standups = await Standup.find({ teamId, date }).populate(
      "userId",
      "name",
    );

    // 2. Call our AI Service
    const summary = await createTeamDigest(standups);

    // 3. Save or Update the digest
    const digest = await Digest.findOneAndUpdate(
      { teamId, date },
      { summary, generatedAt: Date.now() },
      { upsert: true, returnDocument: "after" },
    );

    res.json({ success: true, data: digest });
  } catch (err) {
    res.status(500).json({ success: false, message: "AI generation failed" });
  }
}
