import AuthGuard from "@/components/AuthGuard";
import { getAdminDataAction } from "@/actions/admin";
import AdminDashboard from "./AdminDashboard";

export default async function TeamBoardPage() {
  const { success, teams, users } = await getAdminDataAction();

  if (!success)
    return (
      <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl">
        <p className="text-muted-foreground">You don't own any teams yet.</p>
      </div>
    );

  return (
    <AuthGuard requireAdmin>
      <AdminDashboard success={success} teams={teams} users={users} />
    </AuthGuard>
  );
}
