"use client";

import { useQuery } from "@tanstack/react-query";
import { SIWEController, SIWESession } from "@web3modal/siwe";

export const useSession = () =>
  useQuery<SIWESession | null | undefined>({
    queryKey: ["session"],
    queryFn: async () =>
      (await SIWEController.getSession()) || ({} as SIWESession),

    enabled: !!SIWEController.state.status,
  });
