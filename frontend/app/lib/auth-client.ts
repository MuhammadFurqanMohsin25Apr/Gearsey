import { createAuthClient } from "better-auth/react";
import type { auth } from "../../../backend/src/lib/auth";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});

export const { useSession, signOut } = authClient;

