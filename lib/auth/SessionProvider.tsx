"use client";
import { useQueryClient } from "@tanstack/react-query";
import { SIWEController } from "@web3modal/siwe";
import { Fragment, ReactNode, useEffect } from "react";

export function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = SIWEController.subscribeKey("session", (session) => {
      queryClient.setQueryData(["session"], session || {});
    });
    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return <Fragment>{children}</Fragment>;
}
