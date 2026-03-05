import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encryptCredentials, decryptCredentials } from '@/lib/encryption';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  credentials: string | null;
  setCredentials: (username: string, password: string) => void;
  getDecryptedCredentials: () => { username: string; password: string } | null;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      username: null,
      credentials: null,

      setCredentials: (username: string, password: string) => {
        const encrypted = encryptCredentials({ username, password });
        set({
          isAuthenticated: true,
          username,
          credentials: encrypted,
        });
      },

      getDecryptedCredentials: () => {
        const { credentials } = get();
        if (!credentials) return null;
        return decryptCredentials(credentials);
      },

      logout: () => {
        set({
          isAuthenticated: false,
          username: null,
          credentials: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        username: state.username,
        credentials: state.credentials,
      }),
    }
  )
);
