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

export default function UserMenu({ isExpanded = false } = {}) {
  const { disconnectAsync } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const { open } = useWeb3Modal();
  const { data: session } = useSession();

  const truncatedAddress = `1234`;

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
      onClick={() => disconnectAsync()}
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
          disabled={!session?.user}
          variant="ghost"
          size={"icon"}
          className={`rounded-full size-8 ${isExpanded ? "flex w-full h-10 items-center justify-start rounded-lg px-1.5 py-2 transition-colors hover:bg-accent hover:text-accent-foreground" : ""}`}
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
            <span className="ml-2 text-base text-muted-foreground">
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
