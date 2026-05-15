import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

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

  let decoded: any;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    decoded = (await jwtVerify(token, secret)).payload;
  } catch {
    redirect("/login");
  }

  // 2. Optional: Basic role check if encoded in JWT
  if (requireAdmin && decoded.role !== "admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
