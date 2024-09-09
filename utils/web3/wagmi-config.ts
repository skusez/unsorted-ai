import { defaultWagmiConfig } from "@web3modal/wagmi/react";
import { Config, cookieStorage, createStorage } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

if (!projectId) {
  throw new Error(
    "You need to provide NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable"
  );
}

// 2. Create wagmiConfig
export const metadata = {
  name: "AI App",
  description: "Web3Modal Example",
  url: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, sepolia] as any,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }) as any,
}) as Config;
