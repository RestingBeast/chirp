import AuthGuard from "@/components/AuthGuard";
import DashboardContent from "./DashboardContent";

export default function DashboardPage() {
  return (
    <AuthGuard>
      {/* The Guard checks for the 'token' cookie on the server.
          If it's not there, the user is redirected before this 
          content ever touches the browser.
      */}
      <DashboardContent />
    </AuthGuard>
  );
}
