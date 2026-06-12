import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const TIMEOUT_MS = 30_000;

class ApiError extends Error {
  errors?: { field: string; message: string }[];

  constructor(message: string, errors?: { field: string; message: string }[]) {
    super(message);
    this.name = "ApiError";
    this.errors = errors;
  }
}

async function request(method: string, path: string, body?: unknown) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      ...(body !== undefined && { body: JSON.stringify(body) }),
      cache: "no-store",
      signal: controller.signal,
    });

    const data = await res.json();
    if (!res.ok) throw new ApiError(data.message || "Request failed", data.errors);
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export const serverApiClient = {
  get: (path: string) => request("GET", path),
  post: (path: string, body: unknown) => request("POST", path, body),
  put: (path: string, body: unknown) => request("PUT", path, body),
  patch: (path: string, body: unknown) => request("PATCH", path, body),
  delete: (path: string) => request("DELETE", path),
};
