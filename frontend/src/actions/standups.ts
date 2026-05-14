"use server";

import { serverApiClient } from "@/lib/apiClient.server";
import { revalidatePath } from "next/cache";

export async function submitStandupAction(formData: {
  teamId: string;
  yesterday: string;
  today: string;
  blockers: string;
}) {
  try {
    const response = await serverApiClient.post("/api/standups", formData);
    revalidatePath("/board"); // Refresh the team board data
    return { success: true, data: response };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.message ||
        "Failed to submit standup. You might have already posted today.",
    };
  }
}

export async function getTeamBoardAction(teamId: string) {
  try {
    // This calls your GET /api/standups/team/:teamId route
    const data = await serverApiClient.get(`/api/standups/team/${teamId}`);
    return { success: true, standups: data.data, date: data.date };
  } catch (error: any) {
    return { success: false, message: "Failed to load team board" };
  }
}
