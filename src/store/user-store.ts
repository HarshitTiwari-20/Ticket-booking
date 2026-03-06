import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encryptCredentials, decryptCredentials } from '@/lib/encryption';

interface User {
  id: string;
  username: string;
  email: string;
  encryptedPassword: string;
  createdAt: string;
}

interface UserStoreState {
  users: User[];
  registerUser: (username: string, email: string, password: string) => { success: boolean; error?: string };
  getUserByUsername: (username: string) => User | undefined;
  validateCredentials: (username: string, password: string) => boolean;
  getAllUsers: () => User[];
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      users: [],

      registerUser: (username: string, email: string, password: string) => {
        const { users } = get();

        // Check if user already exists
        if (users.some((u) => u.username === username)) {
          return { success: false, error: 'Username already taken' };
        }

        if (users.some((u) => u.email === email)) {
          return { success: false, error: 'Email already registered' };
        }

        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          username,
          email,
          encryptedPassword: encryptCredentials(password) || password,
          createdAt: new Date().toISOString(),
        };

        set({ users: [...users, newUser] });
        return { success: true };
      },

      getUserByUsername: (username: string) => {
        const { users } = get();
        return users.find((u) => u.username === username);
      },

      validateCredentials: (username: string, password: string) => {
        const user = get().getUserByUsername(username);
        if (!user) return false;

        try {
          const decrypted = decryptCredentials(user.encryptedPassword);
          return decrypted === password;
        } catch {
          return user.encryptedPassword === password;
        }
      },

      getAllUsers: () => {
        return get().users;
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        users: state.users,
      }),
    }
  )
);
