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
    revalidatePath("/board");
    return { success: true, data: response };
  } catch (error: unknown) {
    const msg =
      error instanceof Error
        ? error.message
        : ((error as any)?.message ??
          "Failed to submit standup. You might have already posted today.");
    return { success: false, message: msg };
  }
}

export async function getTeamBoardAction(teamId: string, date?: string) {
  try {
    // Build URL — append ?date=YYYY-MM-DD only when explicitly provided
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    const query = params.size > 0 ? `?${params.toString()}` : "";

    const data = await serverApiClient.get(
      `/api/standups/team/${teamId}${query}`,
    );

    return {
      success: true,
      standups: data.data,
      date: data.date,
      digest: data.digest,
    };
  } catch (error: any) {
    return { success: false, message: "Failed to load team board." };
  }
}
