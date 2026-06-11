import AuthGuard from "@/components/AuthGuard";
import { getAdminDataAction } from "@/actions/admin";
import AdminUsers from "./AdminUsers";

export default async function AdminUsersPage() {
  const { teams, users } = await getAdminDataAction();

  return (
    <AuthGuard requireAdmin>
      <AdminUsers initialUsers={users} initialTeams={teams} />
    </AuthGuard>
  );
}
