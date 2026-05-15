"use server";

import { serverApiClient } from "@/lib/apiClient.server";
import { getServerSession } from "@/lib/session";

export async function createInviteAction(formData: {
  email: string;
  teamId?: string;
}) {
  try {
    const session = await getServerSession();
    if (!session) throw new Error("Not authenticated");
    if (session.role !== "admin") throw new Error("Forbidden");

    const response = await serverApiClient.post(
      "/api/invites/create",
      formData,
    );
    return { success: true, url: response.data.joinLink };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create invites.",
    };
  }
}
