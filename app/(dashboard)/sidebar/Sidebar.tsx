"use client";
import { motion } from "framer-motion";
import React from "react";
import { observer, reactive } from "@legendapp/state/react";
import { useSidebar } from "./sidebar-context";
import { SidebarContent } from "./sidebar-content";

const MotionAside = reactive(motion.aside);

export const Sidebar = observer(function Sidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state$: sidebar$ } = useSidebar();

  return (
    <>
      <MotionAside
        className="fixed items-start overflow-hidden inset-y-0 left-0 z-40 flex flex-col border-r bg-background hidden sm:flex"
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
        <SidebarContent />
      </MotionAside>
      <div
        className={`flex flex-col flex-grow transition-all duration-300 ${
          sidebar$.isOpen.get() ? "sm:ml-64" : "sm:ml-16"
        }`}
      >
        {children}
      </div>
    </>
  );
});
