import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      teamId: decoded.teamId,
    };
  } catch {
    return null;
  }
}
