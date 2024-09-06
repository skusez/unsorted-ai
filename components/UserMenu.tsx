"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown, Wallet, User } from "lucide-react";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export default function UserMenu() {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const [isOpen, setIsOpen] = useState(false);

  if (!isConnected || !address) return null;

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

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
      <span className="mr-2">Wallet:</span>
      <span className="font-mono">{truncatedAddress}</span>
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
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://avatars.dicebear.com/api/initials/${address}.svg`}
              alt={truncatedAddress}
            />
            <AvatarFallback>{address.slice(2, 4)}</AvatarFallback>
          </Avatar>
          <ChevronDown className="ml-2 h-4 w-4" />
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
