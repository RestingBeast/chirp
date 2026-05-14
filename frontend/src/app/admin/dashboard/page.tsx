import AuthGuard from "@/components/AuthGuard";
import { getAdminTeamsAction } from "@/actions/team";
import AdminDashboard from "./AdminDashboard";

export default async function TeamBoardPage() {
  const { teams, success } = await getAdminTeamsAction();

  if (!success)
    return (
      <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl">
        <p className="text-muted-foreground">You don't own any teams yet.</p>
      </div>
    );

  return (
    <AuthGuard requireAdmin>
      <AdminDashboard success={success} teams={teams} />
    </AuthGuard>
  );
}
