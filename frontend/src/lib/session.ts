import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { Payload } from "@/types/auth.types";

export async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload }: { payload: Payload } = await jwtVerify(token, secret);
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      teamId: payload.teamId,
    };
  } catch {
    return null;
  }
}
