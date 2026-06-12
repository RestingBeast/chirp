"use server";

import { serverApiClient } from "@/lib/apiClient.server";

export async function getUsersAction() {
  try {
    const response = await serverApiClient.get("/api/users");
    return { success: true, users: response.data };
  } catch (error: unknown) {
    const msg =
      error instanceof Error
        ? error.message
        : ((error as any)?.message ?? "Failed to load users.");
    return { success: false, message: msg, users: [] };
  }
}
