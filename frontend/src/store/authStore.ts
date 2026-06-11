import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, Payload } from "@/types/auth.types";

interface SimpleAuthStore extends AuthState {
  setUser: (user: Payload | null) => void;
  logout: () => void;
}

export const useAuthStore = create<SimpleAuthStore>()(
  persist(
    (set) => ({
      user: null,
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
