import Standup from "../models/standup.model.js";

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

    // 1. Find all standups for this team on this date
    // We populate the userId to get the member's name and email for the UI
    const standups = await Standup.find({ teamId, date })
      .populate("userId", "name email")
      .sort({ createdAt: 1 }); // Show who posted first

    res.json({
      success: true,
      date,
      count: standups.length,
      data: standups,
    });
  } catch (err) {
    console.error("[getTeamStandups]", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch team board" });
  }
}
