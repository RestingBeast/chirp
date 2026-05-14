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
