"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useSignMessage } from "wagmi";
import { Button } from "./ui/button";
import { signInWithWeb3 } from "@/utils/supabase/web3-auth-provider";
import { useState } from "react";

export default function WalletConnectButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (isConnected && address) {
      setIsLoading(true);
      try {
        const message = `Sign this message to authenticate with Supabase: ${Date.now()}`;
        const signature = await signMessageAsync({ message });
        await signInWithWeb3(address);
      } catch (error) {
        console.error("Error during Web3 authentication:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      open();
    }
  };

  return (
    <Button
      onClick={handleAuth}
      variant="outline"
      size="sm"
      disabled={isLoading}
    >
      {isLoading
        ? "Authenticating..."
        : isConnected
          ? "Authenticate with Web3"
          : "Connect Wallet"}
    </Button>
  );
}
