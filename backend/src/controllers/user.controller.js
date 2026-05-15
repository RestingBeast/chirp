import User from "../models/user.model.js";

/**
 * Retrieves all users from the database.
 * Returns safe objects excluding sensitive data.
 */
export const getAllUsers = async (req, res) => {
  try {
    // 1. Fetch all users from the database
    const users = await User.find({ role: "member" }).populate(
      "teamId",
      "name",
    );

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

    // 2. Perform the update
    // If teamId is "none" or null, we set it to null in the DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { teamId: teamId === "none" || !teamId ? null : teamId },
      { role: "member" },
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
