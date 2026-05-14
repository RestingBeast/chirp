import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

type Payload = {
  id: string;
  email: string;
  role: "member" | "admin";
  teamId: string;
};

export async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded: Payload = jwtDecode(token);
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
