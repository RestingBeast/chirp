import AuthGuard from "@/components/AuthGuard";
import { getUsersAction } from "@/actions/users";
import AdminUsers from "./AdminUsers";

export default async function AdminUsersPage() {
  const { users } = await getUsersAction();

  return (
    <AuthGuard requireAdmin>
      <AdminUsers initialUsers={users} />
    </AuthGuard>
  );
}
