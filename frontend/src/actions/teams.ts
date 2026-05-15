"use server";

import { serverApiClient } from "@/lib/apiClient.server";
import { revalidatePath } from "next/cache";

/**
 * Server action to be called by the AssignUserForm.
 */
export async function assignUserAction({
  userId,
  teamId,
}: {
  userId: string;
  teamId: string;
}) {
  try {
    // Calls the controller endpoint created above
    const response = await serverApiClient.put("/api/users/assign", {
      userId,
      teamId,
    });

    // Refresh the dashboard to show updated team memberships
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error: unknown) {
    const msg =
      error instanceof Error
        ? error.message
        : ((error as any)?.message ?? "Failed to assign user.");
    return { success: false, message: msg };
  }
}

export async function getTeamMembersAction(teamId: string) {
  try {
    const response = await serverApiClient.get(`/api/teams/${teamId}/members`);
    return {
      success: true,
      members: response.data,
    };
  } catch (error: unknown) {
    const msg =
      error instanceof Error
        ? error.message
        : ((error as any)?.message ?? "Failed to load members");
    return { success: false, message: msg };
  }
}
