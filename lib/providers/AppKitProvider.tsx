"use client";

import React, { ReactNode } from "react";
import { getWagmiConfig, metadata } from "@/utils/web3/wagmi-config";

import { createWeb3Modal } from "@web3modal/wagmi/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { State, WagmiProvider } from "wagmi";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "You need to provide NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable"
  );
}

// Create modal
createWeb3Modal({
  metadata,
  wagmiConfig: getWagmiConfig(),
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export default function AppKitProvider({
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
    <WagmiProvider config={getWagmiConfig()} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
