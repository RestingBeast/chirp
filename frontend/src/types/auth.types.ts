export interface Payload {
  sub: string;
  name: string;
  email: string;
  role: "admin" | "user";
  teamId: string;
}

export interface AuthState {
  user: Payload | null;
  isLoading: boolean;
  error: string | string[] | null;
}

export interface AuthActions {
  register: (data: any) => Promise<{ success: boolean; error?: any }>;
  login: (data: any) => Promise<{ success: boolean; error?: any }>;
  logout: () => void;
  clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;
