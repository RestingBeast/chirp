import mongoose from "mongoose";
import User from "../src/models/user.model.js";
import Team from "../src/models/team.model.js";
import Standup from "../src/models/standup.model.js";
import Digest from "../src/models/digest.model.js";
import Invite from "../src/models/invite.model.js";
import dns from "node:dns";

// Using Google Public DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Update this with your actual connection string
const MONGO_URI = process.env.MONGO_URI;

// FIX 1: Return a real Date object with a realistic time
const getSeedDate = (daysAgo = 0, hour = 9) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  // Set a specific hour (e.g., 9 AM) and a random minute/second
  d.setHours(
    hour,
    Math.floor(Math.random() * 59),
    Math.floor(Math.random() * 59),
  );
  return d;
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
      Invite.deleteMany({}),
    ]);

    // 2. Create Admin
    const admin = await User.create({
      name: "Chirp Admin",
      email: "admin@test.com",
      passwordHash: "Admin1234",
      role: "admin",
    });

    // 3. Create Team
    // Added a log here so you can verify the ID in your terminal
    const engineeringTeam = await Team.create({
      name: "Engineering",
      adminId: admin._id,
    });
    console.log(
      `Team Created: ${engineeringTeam.name} (${engineeringTeam._id})`,
    );

    // 4. Create Members
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
          invitedBy: admin._id,
          teamId: engineeringTeam._id,
        }),
      ),
    );

    const seedContent = [
      {
        date: getSeedDate(1), // Yesterday

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
        date: getSeedDate(0), // Today

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
    // 5. Generate Standups
    const days = [1, 0]; // 1 = Yesterday, 0 = Today

    for (const daysAgo of days) {
      const timestamp = getSeedDate(daysAgo); // This now has a real time!

      // We use the index to match the users to the content frame
      const frameIndex = daysAgo === 1 ? 0 : 1;
      const frame = seedContent[frameIndex];

      await Promise.all(
        users.map(async (user) => {
          const data = frame.standups.find((s) => s.name === user.name);

          // FIX 2: Use a Mongoose Document instance to bypass timestamp overwriting
          const newStandup = new Standup({
            userId: user._id,
            teamId: engineeringTeam._id,
            date: timestamp.toISOString().split("T")[0], // Keep the YYYY-MM-DD for your queries
            yesterday: data.yesterday,
            today: data.today,
            blockers: data.blockers,
            createdAt: timestamp, // Force the specific time
          });

          // save({ timestamps: false }) prevents Mongoose from resetting createdAt to "now"
          return newStandup.save({ timestamps: false });
        }),
      );

      await Digest.create({
        teamId: engineeringTeam._id,
        date: timestamp.toISOString().split("T")[0],
        summary: frame.digest,
        createdAt: timestamp,
      });
    }

    // Create the invite
    const invites = [
      {
        email: "beta-tester1@example.com",
        role: "member",
      },
      {
        email: "beta-tester2@example.com",
        role: "member",
      },
    ];

    console.log("Creating Invite!");
    for (const data of invites) {
      const res = await Invite.create({
        email: data.email,
        role: data.role,
        createdBy: admin._id,
      });

      const baseUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
      console.log(
        `Join Link for ${res.email}: ${baseUrl}/join?token=${res.token}`,
      );
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
