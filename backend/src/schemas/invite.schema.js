import { z } from "zod";
import { emailField } from "./common.schema.js";

export const createInviteSchema = z.object({
  // Reuse your standardized email validation
  email: emailField,

  // Validate that the role is one of your allowed types
  role: z
    .enum(["member", "admin"], {
      errorMap: () => ({ message: "Role must be either 'member' or 'admin'" }),
    })
    .default("member"),

  // Ensures teamId is a valid MongoDB ObjectId string (24 hex characters)
  teamId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Team ID format")
    .optional(),
});
