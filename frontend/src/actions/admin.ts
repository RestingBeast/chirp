"use server";

import { serverApiClient } from "@/lib/apiClient.server";
import { Team } from "@/types/team.types";
import { User } from "@/types/user.types";
import { revalidatePath } from "next/cache";

export async function getAdminDataAction() {
  try {
    const [teamsResponse, usersResponse] = await Promise.all([
      serverApiClient.get("/api/teams"),
      serverApiClient.get("/api/users"),
    ]);

    const users = usersResponse.data;
    // Map through teams and inject the count by checking user.teamId
    const teamsWithCounts = teamsResponse.data.map((team: Team) => ({
      ...team,
      memberCount: users.filter((u: User) => u.teamId?._id === team._id).length,
    }));

    return {
      success: true,
      teams: teamsWithCounts,
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

export async function updateUserAction(
  userId: string,
  data: { name?: string; password?: string },
) {
  try {
    const response = await serverApiClient.patch(`/api/users/${userId}`, data);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    console.log(error);
    const err = error as any;
    const msg =
      error instanceof Error
        ? error.message
        : (err?.message ?? "Failed to update user.");
    return { success: false, message: msg, errors: err?.errors };
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

export async function deleteUserAction(userId: string) {
  try {
    await serverApiClient.delete(`/api/users/${userId}`);
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: unknown) {
    const msg =
      error instanceof Error
        ? error.message
        : ((error as any)?.message ?? "Failed to delete user.");
    return { success: false, message: msg };
  }
}

export async function renameTeamAction(teamId: string, name: string) {
  try {
    const response = await serverApiClient.patch(`/api/teams/${teamId}`, {
      name,
    });
    revalidatePath("/admin/dashboard");
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as any;
    const msg =
      error instanceof Error
        ? error.message
        : err?.message ?? "Failed to rename team.";
    return { success: false, message: msg, errors: err?.errors };
  }
}

export async function deleteTeamAction(teamId: string) {
  try {
    const response = await serverApiClient.delete(`/api/teams/${teamId}`);
    revalidatePath("/admin/dashboard"); // Refresh the grid
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const msg =
      error instanceof Error
        ? error.message
        : ((error as any)?.message ?? "Failed to delete team.");
    return { success: false, message: msg };
  }
}
