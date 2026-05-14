import AuthGuard from "@/components/AuthGuard";
import StandupForm from "./StandupForm";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <StandupForm />
    </AuthGuard>
  );
}
