export interface Payload {
  sub: string;
  name: string;
  email: string;
  role: "admin" | "member";
  teamId: string;
}

export interface AuthState {
  user: Payload | null;
}
