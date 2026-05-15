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
  } catch (error: unknown) {
    const msg =
      error instanceof Error
        ? error.message
        : ((error as any)?.message ?? "Failed to create invite.");
    return { success: false, message: msg };
  }
}
