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
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Invalid email or password",
    };
  }
}

export async function registerAction(payload: any) {
  try {
    const data = await serverApiClient.post("/api/auth/register", payload);

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
  } catch (error: any) {
    // If your backend returns Zod errors as an array, pass them through
    return {
      success: false,
      message: error.message || "Registration failed",
      errors: error.errors,
    };
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

  redirect("/login");
}

export async function validateInviteAction(token: string) {
  try {
    const data = await serverApiClient.get(`/api/invites/${token}`);
    return { success: true, email: data.email };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Invite link is invalid or has expired",
    };
  }
}
