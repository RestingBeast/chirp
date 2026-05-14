"use server";

import { serverApiClient } from "@/lib/apiClient.server";

export async function getAdminTeamsAction() {
  try {
    // Calls your existing getMyTeams function through the API
    const response = await serverApiClient.get("/api/teams");
    return { success: true, teams: response.data };
  } catch (error: any) {
    return { success: false, message: "Failed to load managed teams." };
  }
}
