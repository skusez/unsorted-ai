"use client";

import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

import { useAccount } from "wagmi";
import UserMenu from "./UserMenu";
import useAuth from "@/utils/auth/useAuth";
import { Fragment } from "react";

export default function ConnectWalletButton({
  onSignIn = () => {},
  onSignOut = () => {},
} = {}) {
  const { signIn, isLoading, isSuccess, session } = useAuth({
    onSignIn,
    onSignOut,
  });

  const { address } = useAccount();

  const handleConnectWallet = () => {
    if (!address || !session.data) {
      signIn.mutate();
    }
  };

  if (address && session.data) {
    return <UserMenu />;
  }

  return (
    <Button
      size="sm"
      onClick={handleConnectWallet}
      disabled={isLoading || isSuccess}
      aria-label="Connect wallet"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Fragment>{!!address ? "Sign In" : "Connect Wallet"}</Fragment>
      )}
    </Button>
  );
}
