import AuthGuard from "@/components/AuthGuard";
import ChangePasswordForm from "./ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <AuthGuard>
      <ChangePasswordForm />
    </AuthGuard>
  );
}
