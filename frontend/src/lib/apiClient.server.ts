import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function request(method: string, path: string, body?: unknown) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    ...(body !== undefined && { body: JSON.stringify(body) }),
    cache: "no-store", // Ensure we get fresh data for auth-dependent calls
  });

  const data = await res.json();

  if (!res.ok) throw data;
  return data;
}

export const serverApiClient = {
  get: (path: string) => request("GET", path),
  post: (path: string, body: unknown) => request("POST", path, body),
  put: (path: string, body: unknown) => request("PUT", path, body),
  patch: (path: string, body: unknown) => request("PATCH", path, body),
  delete: (path: string) => request("DELETE", path),
};
