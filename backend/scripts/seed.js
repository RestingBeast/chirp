import mongoose from "mongoose";
import User from "../src/models/user.model.js";
import Team from "../src/models/team.model.js";
import Standup from "../src/models/standup.model.js";
import Digest from "../src/models/digest.model.js";
import dns from "node:dns";

// Using Google Public DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Update this with your actual connection string
const MONGO_URI = process.env.MONGO_URI;

const getDateString = (daysAgo = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0]; // Returns YYYY-MM-DD
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    // 1. Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Standup.deleteMany({}),
      Digest.deleteMany({}),
    ]);

    // 2. Create Admin User (No Team Assigned)
    const admin = await User.create({
      name: "Chirp Admin",
      email: "admin@test.com",
      passwordHash: "Admin1234",
      role: "admin",
      teamId: null,
    });

    // 3. Create One Team managed by the Admin
    const engineeringTeam = await Team.create({
      name: "Engineering",
      adminId: admin._id,
    });

    // 4. Create Three Members assigned to the Engineering team
    const userSeedData = [
      { name: "John Doe", email: "johndoe@test.com" },
      { name: "Jane Smith", email: "janesmith@test.com" },
      { name: "Bob Wilson", email: "bobwilson@test.com" },
    ];

    const users = await Promise.all(
      userSeedData.map((u) =>
        User.create({
          ...u,
          passwordHash: "Test1234",
          role: "member",
          teamId: engineeringTeam._id,
        }),
      ),
    );

    // 5. Generate Meaningful Standups and Digests
    const seedContent = [
      {
        date: getDateString(1), // Yesterday
        digest:
          "Yesterday's focus was on core infrastructure. The team successfully implemented the MongoDB schema for standups and integrated bcrypt for secure admin authentication. No major blockers were reported, though Bob noted minor latency in local DB connections.",
        standups: [
          {
            name: "John Doe",
            yesterday: "Defined the Mongoose schemas for Teams and Standups.",
            today: "Implementing the server-side controller for team creation.",
            blockers: "None",
          },
          {
            name: "Jane Smith",
            yesterday:
              "Set up the Next.js project structure and shadcn/ui components.",
            today: "Building the initial Admin Dashboard layout and team grid.",
            blockers: "None",
          },
          {
            name: "Bob Wilson",
            yesterday:
              "Configured the shared AuthStore using Zustand for session management.",
            today:
              "Connecting the login form to the backend authentication API.",
            blockers:
              "Dealing with some minor environment variable loading issues.",
          },
        ],
      },
      {
        date: getDateString(0), // Today
        digest:
          "Today the team shifted toward user-facing features. John is finalizing team assignments, while Jane is hardening the standup submission flow with confirmation dialogs. The project is on track for the Phase 2 milestone with all members unblocked.",
        standups: [
          {
            name: "John Doe",
            yesterday:
              "Finished the team creation API and validated administrative roles.",
            today:
              "Working on the AssignUserForm to allow admins to move members between teams.",
            blockers: "None",
          },
          {
            name: "Jane Smith",
            yesterday:
              "Integrated the team grid into the dashboard with real-time stats.",
            today:
              "Adding an AlertDialog to the StandupForm to prevent accidental submissions.",
            blockers: "None",
          },
          {
            name: "Bob Wilson",
            yesterday:
              "Resolved auth middleware bugs and successfully tested login flow.",
            today:
              "Developing the Team Board view to fetch and display daily standup cards.",
            blockers: "None",
          },
        ],
      },
    ];

    for (const frame of seedContent) {
      // Create the Standups
      await Promise.all(
        users.map((user) => {
          const data = frame.standups.find((s) => s.name === user.name);
          return Standup.create({
            userId: user._id,
            teamId: engineeringTeam._id,
            date: frame.date,
            yesterday: data.yesterday,
            today: data.today,
            blockers: data.blockers,
          });
        }),
      );

      // Create the Digest
      await Digest.create({
        teamId: engineeringTeam._id,
        date: frame.date,
        summary: frame.digest,
      });
    }

    console.log("Database seeded successfully!");
    console.log("- 1 Admin (No Team)");
    console.log("- 1 Team (Engineering)");
    console.log("- 3 Users assigned to Engineering");
    console.log("- Standups & Digests created for Today & Yesterday");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
