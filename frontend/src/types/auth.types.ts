export interface Payload {
  sub: string;
  name: string;
  email: string;
  role: "admin" | "user";
  teamId: string;
}

export interface AuthState {
  user: Payload | null;
}
