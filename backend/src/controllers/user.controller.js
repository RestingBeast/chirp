import User from "../models/user.model.js";
import Team from "../models/team.model.js";

/**
 * Retrieves all users from the database.
 * Returns safe objects excluding sensitive data.
 */
export const getAllUsers = async (req, res) => {
  try {
    // 1. Fetch non-deleted users invited by this admin
    const users = await User.find({
      role: "member",
      deletedAt: null,
      invitedBy: req.user.sub,
    }).populate([
      { path: "teamId", select: "name" },
      { path: "invitedBy", select: "name email" },
    ]);

    // 2. Use your toSafeObject method to sanitize each user
    // This ensures passwordHash is not included in the response
    const safeUsers = users.map((user) => user.toSafeObject());

    return res.status(200).json({
      success: true,
      count: safeUsers.length,
      data: safeUsers,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error occurred while fetching users",
    });
  }
};

/**
 * Assigns a user to a specific team.
 * Expects userId and teamId in the request body.
 */
export const assignUserToTeam = async (req, res) => {
  try {
    const { userId, teamId } = req.body;

    if (teamId && teamId !== "none") {
      const team = await Team.findOne({
        _id: teamId,
        adminId: req.user.sub,
      });
      if (!team) {
        return res
          .status(403)
          .json({ success: false, message: "You do not own this team" });
      }
    }

    // 2. Perform the update — skip soft-deleted users
    // If teamId is "none" or null, we set it to null in the DB
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, deletedAt: null },
      { teamId: teamId === "none" || !teamId ? null : teamId },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Assigned ${updatedUser.name} successfully`,
      data: updatedUser.toSafeObject(),
    });
  } catch (error) {
    console.error("Error in assignUserToTeam:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during assignment" });
  }
};

/**
 * Updates a user's name and/or password.
 * Expects userId as a route parameter, and name/password in the request body.
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password } = req.body;

    const user = await User.findOne({ _id: id, deletedAt: null });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.invitedBy?.toString() !== req.user.sub) {
      return res
        .status(403)
        .json({ success: false, message: "You did not invite this user" });
    }

    if (name !== undefined) user.name = name;
    if (password !== undefined) user.passwordHash = password;

    await user.save();

    return res.status(200).json({
      success: true,
      message: `${user.name} updated successfully`,
      data: user.toSafeObject(),
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during user update" });
  }
};

/**
 * Soft-deletes a user by setting deletedAt to the current date.
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id, deletedAt: null });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.invitedBy?.toString() !== req.user.sub) {
      return res
        .status(403)
        .json({ success: false, message: "You did not invite this user" });
    }

    await User.findByIdAndUpdate(id, {
      deletedAt: new Date(),
      teamId: null,
    });

    return res.status(200).json({
      success: true,
      message: `${user.name} has been deactivated`,
    });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during user deletion" });
  }
};
