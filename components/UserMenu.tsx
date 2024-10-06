"use client";

import { useState } from "react";
import { useAccount, useDisconnect, useEnsAvatar } from "wagmi";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Wallet, User, LogOut } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { cn } from "@/lib/utils";
import { SIWEController } from "@web3modal/siwe";

export default function UserMenu({
  isExpanded = false,
  className = "",
  addressClassName = "",
}: {
  isExpanded?: boolean;
  className?: string;
  addressClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { open } = useWeb3Modal();
  const { data: session } = useSession();
  const { address } = useAccount();
  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "Connect Wallet";

  const menuItems = [
    <Button
      key="wallet"
      variant="ghost"
      className="w-full justify-start"
      onClick={() => {
        open();
        setIsOpen(false);
      }}
    >
      <Wallet className="mr-2 h-4 w-4 " />
      <span className="">{truncatedAddress}</span>
    </Button>,
    <Button
      key="account"
      variant="ghost"
      className="w-full justify-start"
      asChild
    >
      <Link href="/account">
        <User className="mr-2 h-4 w-4" />
        Account
      </Link>
    </Button>,

    <Button
      key="logout"
      variant="ghost"
      className="w-full justify-start"
      onClick={() => SIWEController.signOut()}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>,
  ];

  const { data: ensAvatar } = useEnsAvatar();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={!session?.id}
          className={cn(
            ` h-10 rounded-lg  overflow-hidden  flex justify-start transition-all  px-1.5  duration-200  hover:bg-accent hover:text-accent-foreground bg-primary w-full`,
            className
          )}
        >
          <div className="flex ml-1.5 items-center">
            <User className="size-5" />

            {isExpanded && (
              <span
                className={cn(
                  "ml-2 text-sm    text-muted-foreground",
                  addressClassName
                )}
              >
                {truncatedAddress}
              </span>
            )}
            <span className="sr-only">Open user menu</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {menuItems.map((item, index) => (
          <DropdownMenuItem key={index} asChild>
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
