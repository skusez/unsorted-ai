"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { metadata, wagmiConfig } from "@/utils/web3/wagmi-config";

import { createWeb3Modal } from "@web3modal/wagmi/react";

import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";

import { State, WagmiProvider } from "wagmi";
import {
  createSIWEConfig,
  formatMessage,
  SIWEVerifyMessageArgs,
  type SIWECreateMessageArgs,
} from "@web3modal/siwe";
import { mainnet, sepolia } from "wagmi/chains";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Hex } from "viem";
import { signInWithWeb3 } from "@/utils/auth/signInWithWeb3";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "You need to provide NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable"
  );
}

const supabase = createClient();

const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: typeof window !== "undefined" ? window.location.host : "",
    uri: typeof window !== "undefined" ? window.location.origin : "",
    chains: [mainnet.id, sepolia.id],
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

    // Assuming you store the address and chainId in the session
    const { user } = session;
    const address = user.user_metadata.web3_address;
    const chainId = user.user_metadata.web3_chain_id;
    return { address, chainId };
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
      const { data, error } = await signInWithWeb3(message, signature as Hex);
      if (error) throw error;
      return Boolean(data);
    } catch (error) {
      return false;
    }
  },
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error signing out:", error);
      return false;
    }
  },
});
function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.setQueryData(["session"], session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return <>{children}</>;
}
// Create modal
createWeb3Modal({
  metadata,
  wagmiConfig,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  siweConfig,
});

export default function AppKitProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // configure as per your needs
          },
        },
      })
  );
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>{children}</SessionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
