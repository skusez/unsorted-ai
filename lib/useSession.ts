"use client";

import { useQuery } from "@tanstack/react-query";
import { SIWEController, SIWESession } from "@web3modal/siwe";

export const useSession = () => {
  return useQuery<SIWESession | null | undefined>({
    queryKey: ["session"],
    queryFn: async () => {
      console.log({ status: SIWEController.state.status });
      return (await SIWEController.getSession()) || ({} as SIWESession);
    },
    enabled: !!SIWEController.state.status,
  });
};
