// Temporary placeholder - using auth-context instead
// This file exists because some routes import from it
// but we're using the auth-context system for now

import { useAuth } from "./auth-context";

export const useSession = () => {
  const { user, isAuthenticated } = useAuth();
  return {
    data: user ? { user } : null,
    isPending: false,
  };
};

export const authClient = {
  signOut: async () => {
    // This will be handled by auth-context
    console.warn("Use logout from auth-context instead");
  },
};
