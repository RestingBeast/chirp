import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import {
  authRouter,
  inviteRouter,
  teamRouter,
  standupRouter,
  userRouter,
} from "./routes/index.js";
import dns from "node:dns";

// Using Google Public DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(express.json());

app.use(generalLimiter);

app.use("/api/auth", authRouter);
app.use("/api/invites", inviteRouter);
app.use("/api/teams", teamRouter);
app.use("/api/standups", standupRouter);
app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
