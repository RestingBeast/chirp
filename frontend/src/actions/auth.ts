"use server";

import { serverApiClient } from "@/lib/apiClient.server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: any) {
  try {
    // serverApiClient forwards the request to your Node.js backend
    // Your backend (auth.controller.js) will set the HttpOnly cookie in the response
    const data = await serverApiClient.post(`/api/auth/login`, formData);

    const expirationDays = Number(process.env.TOKEN_EXPIRATION);
    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge:
        60 * 60 * 24 * (Number.isNaN(expirationDays) ? 7 : expirationDays),
    });

    return { success: true, user: data.user };
  } catch (error: unknown) {
    const msg =
      error instanceof Error
        ? error.message
        : ((error as any)?.message ?? "Invalid email or password.");
    return { success: false, message: msg };
  }
}

export async function registerAction(payload: any) {
  try {
    const data = await serverApiClient.post("/api/auth/register", payload);

    const maxDays = Number(process.env.COOKIE_MAX_DAYS);
    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * (Number.isNaN(maxDays) ? 7 : maxDays),
    });

    return { success: true, user: data.user };
  } catch (error: unknown) {
    const err = error as any;
    const msg =
      error instanceof Error
        ? error.message
        : (err?.message ?? "Registration failed.");
    return { success: false, message: msg, errors: err };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

  redirect("/");
}

export async function validateInviteAction(token: string) {
  try {
    const data = await serverApiClient.get(`/api/invites/${token}`);
    return { success: true, email: data.email };
  } catch (error: unknown) {
    const msg =
      error instanceof Error
        ? error.message
        : ((error as any)?.message ?? "Invite invalid or expired.");
    return { success: false, message: msg };
  }
}
