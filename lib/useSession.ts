"use client";

import { createClient } from "@/utils/supabase/client";
import { type Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

// Custom hook to get the session

const supabase = createClient();

export const useSession = () => {
  return useQuery<Session | null>({
    queryKey: ["session"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    },
  });
};
