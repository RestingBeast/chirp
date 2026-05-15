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
  } catch (error: any) {
    console.error("Assign User Action Error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to assign user to team.",
    };
  }
}
