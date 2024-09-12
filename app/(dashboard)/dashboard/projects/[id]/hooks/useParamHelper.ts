"use client";
import { useSession } from "@/lib/auth";
import { useParams } from "next/navigation";

export const useParamHelper = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { data: user } = useSession();

  return {
    projectId,
    userId: user?.id,
  };
};
