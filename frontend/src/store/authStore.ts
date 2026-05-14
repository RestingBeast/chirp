import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User } from "@/types/auth.types";

interface SimpleAuthStore extends AuthState {
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<SimpleAuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null, // Always null on client for HttpOnly setup
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),

      logout: () => {
        set({ user: null });
        // Actual cookie removal happens via a Server Action
      },
    }),
    {
      name: "user-session", // Only stores user profile, not sensitive tokens
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
