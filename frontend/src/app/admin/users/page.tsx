import AuthGuard from "@/components/AuthGuard";
import AdminUsers from "./AdminUsers";

export default function AdminUsersPage() {
  return (
    <AuthGuard requireAdmin>
      <AdminUsers />
    </AuthGuard>
  );
}
