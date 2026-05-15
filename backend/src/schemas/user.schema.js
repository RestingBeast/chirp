import z from "zod";
import { teamField } from "./common.schema.js";

export const assignUserSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID"),
  teamId: teamField.optional(),
});
