"use client";

import { useAuthStore } from "@/store/authStore";
import { logoutAction } from "@/actions/auth";

export default function DashboardContent() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    // 1. Clear the local UI state immediately (Optimistic)
    logout();

    // 2. Tell the server to kill the cookie
    // This will also trigger the redirect inside the action
    await logoutAction();
  };

  if (!user) return <div>Loading user profile...</div>;

  return (
    <div>
      <h1>Simple Dashboard</h1>
      <hr />
      <div>
        <strong>Name:</strong> {user.name}
      </div>
      <div>
        <strong>Role:</strong> {user.role}
      </div>
      <hr />
      <button onClick={handleLogout}>Sign Out</button>
    </div>
  );
}
