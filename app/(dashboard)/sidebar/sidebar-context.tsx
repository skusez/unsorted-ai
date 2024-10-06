"use client";
import { useObservable } from "@legendapp/state/react";
import { createContext, useContext } from "react";

type Sidebar = {
  toggleOpen: () => void;
  toggleLocked: () => void;
  isOpen: () => boolean;
  isLocked: () => boolean;
};
function useSidebarState() {
  const state$ = useObservable<Sidebar>(() => {
    return {
      toggleOpen: () => {
        state$.isOpen.set((prev) => {
          if (state$.isLocked.get()) return prev;
          return !prev;
        });
      },
      toggleLocked: () => {
        state$.isLocked.set((prev) => !prev);
      },
      isOpen: false,
      isLocked: false,
    };
  });
  return { state$ };
}
export const SidebarContext = createContext<ReturnType<
  typeof useSidebarState
> | null>(null);

export function SidebarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = useSidebarState();
  return (
    <SidebarContext.Provider value={state}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarContextProvider");
  }
  return context;
}
