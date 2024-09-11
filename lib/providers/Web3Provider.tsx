"use client";

import React, { ReactNode } from "react";
import { metadata, wagmiConfig } from "@/utils/web3/wagmi-config";
import { createWeb3Modal } from "@web3modal/wagmi/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { State, WagmiProvider } from "wagmi";
import { SessionProvider, siweConfig } from "@/lib/auth";
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "You need to provide NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable"
  );
}

// Create modal
createWeb3Modal({
  metadata,
  wagmiConfig,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  siweConfig,
  themeVariables: {
    "--w3m-font-family": "var(--font-body)",
    "--w3m-border-radius-master": "1px",
    "--w3m-accent": "hsl(var(--primary))",
    "--w3m-color-mix": "hsl(var(--accent))",
  },
});

export default function Web3Provider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
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
