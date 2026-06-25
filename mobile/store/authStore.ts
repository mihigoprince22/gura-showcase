import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  email: string;
  username: string;
  district: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  setAuth: (data: {
    token: string;
    refreshToken: string;
    user: User;
  }) => void;
  logout: () => void;
  setOnboarded: (value: boolean) => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isOnboarded: false,

      setAuth: ({ token, refreshToken, user }) =>
        set({
          token,
          refreshToken,
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),

      setOnboarded: (value) =>
        set({
          isOnboarded: value,
        }),

      updateUser: (partial) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...partial } });
        }
      },
    }),
    {
      name: "gura-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
