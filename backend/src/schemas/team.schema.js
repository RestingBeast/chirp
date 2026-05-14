import { z } from "zod";

export const createTeamSchema = z.object({
  name: z
    .string({ required_error: "Team name is required" })
    .trim()
    .min(2, "Team name must be at least 2 characters")
    .max(32, "Team name is too long"),

  adminId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Admin ID format")
    .optional(),
});
