"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserMenu from "@/components/UserMenu";
import { motion } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { observer, reactive, Show } from "@legendapp/state/react";
import { useSidebar } from "./sidebar-context";

const MotionAside = reactive(motion.aside);

const navItems = [
  { href: "/dashboard", icon: HomeIcon, label: "Dashboard" },
  {
    href: "/dashboard/projects/create",
    icon: PlusIcon,
    label: "Create Project",
  },
];

export const Sidebar = observer(SidebarComponent);

function SidebarComponent({ children }: { children: React.ReactNode }) {
  const { state$: sidebar$ } = useSidebar();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <>
      <MotionAside
        className={`fixed items-start overflow-hidden inset-y-0 left-0 z-40 flex flex-col border-r bg-background`}
        animate={{
          width: sidebar$.isOpen.get() ? 256 : 56,
        }}
        onHoverStart={() => {
          if (!sidebar$.isLocked.get()) {
            sidebar$.isOpen.set(true);
          }
        }}
        onHoverEnd={() => {
          if (!sidebar$.isLocked.get()) {
            sidebar$.isOpen.set(false);
          }
        }}
      >
        <nav className="flex flex-col py-4 flex-grow w-full px-1.5">
          <div className="flex-1 space-y-4 ">
            <div className="inline-flex w-32 items-center overflow-hidden space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className={`h-9 rounded-lg w-full  overflow-hidden max-w-10  flex justify-start  `}
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        sidebar$.toggleLocked();
                      }}
                    >
                      <Show
                        if={sidebar$.isLocked.get()}
                        else={<ChevronRightIcon className="size-5 ml-2.5" />}
                      >
                        <ChevronLeftIcon className="size-5 ml-2.5" />
                      </Show>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent side="right">
                    <span>
                      {sidebar$.isLocked.get()
                        ? "Unlock Sidebar"
                        : "Lock Sidebar"}
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Show if={sidebar$.isOpen.get()}>
                {() => (
                  <span className="text-lg w-full animate-in slide-in-from-right-20  duration-300   font-semibold">
                    Logo
                  </span>
                )}
              </Show>
            </div>
            <TooltipProvider>
              {navItems.map(({ href, icon: Icon, label }) => (
                <NavItem
                  key={href}
                  href={href}
                  icon={Icon}
                  label={label}
                  isActive={isActive(href)}
                />
              ))}
            </TooltipProvider>
          </div>
          <div className="space-y-4 ">
            <UserMenu isExpanded={sidebar$.isOpen.get()} />
            <TooltipProvider>
              <NavItem
                href="/settings"
                icon={SettingsIcon}
                label="Settings"
                isActive={isActive("/settings")}
              />
            </TooltipProvider>
          </div>
        </nav>
      </MotionAside>
      <div
        className={`flex flex-col flex-grow transition-all duration-300 ${sidebar$.isOpen.get() ? "ml-64" : "ml-16"}`}
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
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
}) {
  const { state$ } = useSidebar();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={`flex items-center rounded-lg px-3  py-2 transition-colors hover:bg-accent hover:text-accent-foreground ${
            isActive
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          }`}
          prefetch={false}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
          <Show
            if={state$.isOpen.get()}
            else={<span className="sr-only">{label}</span>}
          >
            <span className="ml-3 truncate text-sm">{label}</span>
          </Show>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
