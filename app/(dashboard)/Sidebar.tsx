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

export function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = (href: string) => pathname === href;

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background transition-all duration-300 ease-in-out ${
          isExpanded ? "w-64" : "w-16 items-center"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {isExpanded && (
            <span className="text-lg truncate font-semibold">Your Logo</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </Button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <TooltipProvider>
            {navItems.map(({ href, icon: Icon, label }) => (
              <NavItem
                key={href}
                href={href}
                icon={Icon}
                label={label}
                isExpanded={isExpanded}
                isActive={isActive(href)}
              />
            ))}
          </TooltipProvider>
        </nav>
        <div className="mt-auto p-4">
          <TooltipProvider>
            <NavItem
              href="/settings"
              icon={SettingsIcon}
              label="Settings"
              isExpanded={isExpanded}
              isActive={isActive("/settings")}
            />
          </TooltipProvider>
        </div>
      </aside>
      <div
        className={`flex flex-col flex-grow transition-all duration-300 ${isExpanded ? "ml-64" : "ml-16"}`}
      >
        {children}
      </div>
    </>
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
          className={`flex items-center rounded-lg px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground ${
            isActive
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          }`}
          prefetch={false}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
          {isExpanded ? (
            <span className="ml-3">{label}</span>
          ) : (
            <span className="sr-only">{label}</span>
          )}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
