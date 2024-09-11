import { createClient } from "@/utils/supabase/client";
import { wagmiConfig } from "@/utils/web3/wagmi-config";
import { disconnect, getAccount } from "@wagmi/core";
import {
  createSIWEConfig,
  formatMessage,
  SIWEController,
  SIWECreateMessageArgs,
  SIWESession,
  SIWEVerifyMessageArgs,
} from "@web3modal/siwe";
import { mainnet } from "wagmi/chains";
import { signInWithWeb3 } from "./signInWithWeb3";
import { Hex } from "viem";
import { Tables } from "@/database.types";

declare module "@web3modal/siwe" {
  interface SIWESession extends Tables<"user_profiles"> {
    address: string;
    chainId: number;
  }
}

const supabase = createClient();

// Add this function to fetch the user profile
const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
};

export const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: typeof window !== "undefined" ? window.location.host : "",
    uri: typeof window !== "undefined" ? window.location.origin : "",
    chains: [mainnet.id],
    statement: "Please sign with your account",
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
    formatMessage(args, address),
  getNonce: async () => {
    // get a nonce from the database (custom pg function)
    const { data, error } = await supabase.rpc("generate_nonce");

    if (error) throw error;
    return data as string;
  },
  getSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Failed to get session!");
    }
    const { address, chainId } = getAccount(wagmiConfig);
    const userProfile = await fetchUserProfile(session.user.id);
    return {
      ...userProfile,
      chainId: chainId ?? 1,
      address: address ?? "",
    } as SIWESession;
  },
  verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
    try {
      // Extract nonce from the message
      const nonceMatch = message.match(/Nonce: ([a-fA-F0-9]+)/);
      const nonce = nonceMatch ? nonceMatch[1] : null;

      if (!nonce) {
        throw new Error("Failed to extract nonce from message");
      }

      // Verify the nonce
      const { data: isValid, error: nonceError } = await supabase.rpc(
        "verify_nonce",
        {
          nonce_to_verify: nonce,
        }
      );

      if (nonceError) throw nonceError;

      if (!isValid) {
        throw new Error("Invalid or expired nonce");
      }

      // Sign in with Web3
      const { success } = await signInWithWeb3(message, signature as Hex);
      return success;
    } catch (error) {
      return false;
    }
  },
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      SIWEController.setSession({} as SIWESession);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error signing out:", error);
      return false;
    }
  },

  onSignOut() {
    const sessions = SIWEController.state.session;
    console.log({ sessions });
    disconnect(wagmiConfig);
  },
  onSignIn: async (session) => {
    SIWEController.setSession(session);
  },
});
