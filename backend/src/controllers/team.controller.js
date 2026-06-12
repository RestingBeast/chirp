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
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// controllers/team.controller.js

export const getTeamMembers = async (req, res) => {
  try {
    const { teamId } = req.params;

    // Fetch users assigned to this team
    const members = await User.find({ teamId })
      .select("_id name email role") // Only return necessary fields
      .lean();

    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch team members",
    });
  }
};

export async function renameTeam(req, res) {
  try {
    const { teamId } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Team ID" });
    }

    const team = await Team.findOneAndUpdate(
      { _id: teamId, adminId: req.user.sub },
      { name },
      { returnDocument: "after", runValidators: true },
    );

    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    return res.status(200).json({ success: true, data: team });
  } catch (err) {
    console.error("[renameTeam]", err);
    return res.status(500).json({ success: false, message: "Server error" });
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
    const memberCount = await User.countDocuments({ teamId, deletedAt: null });

    if (memberCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete team: There are still members assigned to it.",
      });
    }

    // 2. Delete the team
    const deletedTeam = await Team.findOneAndDelete({
      _id: teamId,
      adminId: req.user.sub,
    });

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
