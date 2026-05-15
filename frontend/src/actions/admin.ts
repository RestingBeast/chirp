"use server";

import { serverApiClient } from "@/lib/apiClient.server";
import { revalidatePath } from "next/cache";

export async function getAdminDataAction() {
  try {
    const [teamsResponse, usersResponse] = await Promise.all([
      serverApiClient.get("/api/teams"),
      serverApiClient.get("/api/users"),
    ]);

    return {
      success: true,
      teams: teamsResponse.data,
      users: usersResponse.data,
    };
  } catch (error: unknown) {
    console.error("Admin Data Fetch Error:", error);
    const msg =
      error instanceof Error
        ? error.message
        : ((error as any)?.message ?? "Failed to load administrative data.");
    return { success: false, message: msg };
  }
}

export async function createTeamAction(name: string) {
  try {
    const response = await serverApiClient.post("/api/teams", { name });
    return { success: true, teams: response.data };
  } catch (error: unknown) {
    const msg =
      error instanceof Error
        ? error.message
        : ((error as any)?.message ?? "Failed to create team.");
    return { success: false, message: msg };
  }
}

export async function generateTeamDigestAction(teamId: string) {
  try {
    const response = await serverApiClient.post("/api/standups/digest", {
      teamId,
    });
    revalidatePath("/board");
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const msg =
      error instanceof Error
        ? error.message
        : ((error as any)?.message ?? "Server Error during AI generation.");
    return { success: false, message: msg };
  }
}
