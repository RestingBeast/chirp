import Team from "../models/team.model.js";

export async function createTeam(req, res) {
  try {
    console.log(req.user);
    const team = await Team.create({
      name: req.body.name,
      adminId: req.user.sub,
    });
    res.status(201).json({ success: true, data: team });
  } catch (err) {
    console.error("[createTeam]", err);

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A team with this name already exists.",
      });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function getMyTeams(req, res) {
  const teams = await Team.find({ adminId: req.user.sub }).populate(
    "adminId",
    "name email",
  );
  res.json({ success: true, data: teams });
}
