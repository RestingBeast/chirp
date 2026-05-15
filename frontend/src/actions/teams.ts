"use server";

import { serverApiClient } from "@/lib/apiClient.server";
import { getServerSession } from "@/lib/session";

export async function getAdminTeamsAction() {
  try {
    // Calls your existing getMyTeams function through the API
    const response = await serverApiClient.get("/api/teams");
    return { success: true, teams: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to load managed teams.",
    };
  }
}

export async function createTeamAction(name: string) {
  try {
    const session = await getServerSession();
    if (!session) throw new Error("Not authenticated");
    if (session.role !== "admin") throw new Error("Forbidden");

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
