import { z } from "zod";
import { emailField, nameField, passwordField } from "./common.schema.js";

export const registerSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
  inviteToken: z.string().trim().min(1),
});

export const loginSchema = z.object({
  email: emailField,
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"), // no extra rules — avoids leaking policy info
});

export const changePasswordSchema = z.object({
  oldPassword: z
    .string({ required_error: "Current password is required" })
    .min(1, "Current password is required"),
  newPassword: passwordField,
});
