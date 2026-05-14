import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default async function AuthGuard({
  children,
  requireAdmin = false,
}: AuthGuardProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // 1. Check if token exists
  if (!token) {
    redirect("/login");
  }

  // 2. Optional: Basic role check if encoded in JWT
  if (requireAdmin) {
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role !== "admin") {
        redirect("/dashboard");
      }
    } catch {
      redirect("/login");
    }
  }

  return <>{children}</>;
}
