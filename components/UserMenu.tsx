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
import { useSession } from "@/lib/useSession";
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
      <Wallet className="mr-2 h-4 w-4" />
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
          size={"none"}
          className={cn(
            `rounded-full size-8 ${
              isExpanded
                ? "flex w-full h-10 items-center justify-start rounded-lg px-1.5 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                : ""
            }`,
            className
          )}
        >
          <Avatar className="object-cover  size-8">
            <AvatarImage
              className="object-cover"
              src={ensAvatar || undefined}
              alt={truncatedAddress}
            />
            <AvatarFallback className="bg-primary">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          {isExpanded && (
            <span
              className={cn(
                "ml-2 text-base text-muted-foreground",
                addressClassName
              )}
            >
              {truncatedAddress}
            </span>
          )}
          <span className="sr-only">Open user menu</span>
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
