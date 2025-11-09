import { createAuthClient } from 'better-auth/react';

const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:3000';

export const authClient = createAuthClient({
  baseURL: AUTH_URL,
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
