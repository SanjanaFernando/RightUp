import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  title?: string;
  phone?: string;
  avatarUrl?: string;
  intent?: string;
  goals?: string[];
  stage?: string;
  strengths?: string;
  challenges?: string;
  companyName?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  country?: string;
  state?: string;
  city?: string;
  linkedin?: string;
  twitter?: string;
  role?: string;
  createdAt?: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoaded: boolean; // true once we've confirmed state from server
  setUser: (user: AuthUser | null) => void;
  updateUser: (partial: Partial<AuthUser>) => void;
  clearUser: () => void;
  setLoaded: (loaded: boolean) => void;
}

/**
 * Global auth store backed by sessionStorage.
 *
 * - sessionStorage is cleared when the browser tab/window is closed (safer than localStorage).
 * - On client-side navigation (SPA) the store is already populated — zero extra DB calls.
 * - On hard refresh, sessionStorage is read synchronously before the first render,
 *   so the user's profile is available almost instantly.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoaded: false,

      setUser: (user) => set({ user }),

      updateUser: (partial) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...partial } });
        }
      },

      clearUser: () => set({ user: null, isLoaded: true }),

      setLoaded: (loaded) => set({ isLoaded: loaded }),
    }),
    {
      name: "rightup-auth",
      storage: createJSONStorage(() => sessionStorage),
      // Only persist the user data, not transient flags
      partialize: (state) => ({ user: state.user }),
    }
  )
);
