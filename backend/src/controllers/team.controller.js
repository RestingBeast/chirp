import Team from "../models/team.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export async function createTeam(req, res) {
  try {
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

/**
 * Deletes a team only if it has no assigned members.
 */
export const deleteEmptyTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Team ID" });
    }

    // 1. Check if any users are currently assigned to this team
    const memberCount = await User.countDocuments({ teamId });

    if (memberCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete team: There are still members assigned to it.",
      });
    }

    // 2. Delete the team
    const deletedTeam = await Team.findByIdAndDelete(teamId);

    if (!deletedTeam) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Empty team and associated records deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteEmptyTeam:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
