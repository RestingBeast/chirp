import { z } from "zod";
import { teamField } from "./common.schema.js";

export const createStandupSchema = z.object({
  teamId: teamField,
  yesterday: z
    .string({ required_error: "Yesterday's field is required" })
    .min(5, "Too short")
    .max(500, "Keep it under 500 characters"),
  today: z
    .string({ required_error: "Today's field is required" })
    .min(5, "Too short")
    .max(500, "Keep it under 500 characters"),
  blockers: z
    .string()
    .max(500, "Keep it under 500 characters")
    .optional()
    .default("None"),
});
