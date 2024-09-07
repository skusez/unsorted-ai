"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  LineChartIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: HomeIcon, label: "Dashboard" },
  { href: "/dashboard/orders", icon: ShoppingCartIcon, label: "Orders" },
  { href: "/dashboard/models", icon: PackageIcon, label: "Models" },
  { href: "/dashboard/customers", icon: UsersIcon, label: "Customers" },
  { href: "/dashboard/analytics", icon: LineChartIcon, label: "Analytics" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-10 flex flex-col border-r bg-background transition-all duration-300 ease-in-out ${
        isExpanded ? "w-48" : "w-14"
      }`}
    >
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          {navItems.map(({ href, icon, label }) => (
            <NavItem
              key={href}
              href={href}
              icon={icon}
              label={label}
              isExpanded={isExpanded}
              isActive={isActive(href)}
            />
          ))}
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Toggle Sidebar</TooltipContent>
          </Tooltip>
          <NavItem href="#" icon={SettingsIcon} label="Settings" />
        </TooltipProvider>
      </nav>
    </aside>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  isActive = false,
  isExpanded = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  isExpanded?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
            isActive
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          }
              
          ${isExpanded ? "w-full" : "w-9"}
          `}
          prefetch={false}
        >
          <span className={`${isExpanded ? "block" : "sr-only"}`}>{label}</span>
          <Icon className="h-5 w-5" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
