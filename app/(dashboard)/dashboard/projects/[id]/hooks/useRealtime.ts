"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { useSession } from "@/lib/auth";
import { getProjectFilesQueryKey, getUserScoreQueryKey } from "../queryKeys";

const supabase = createClient();

export const useRealtime = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { data: user } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;
    // Create a single channel for all subscriptions
    const channel = supabase.channel("db-changes");

    // User's own contribution score
    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "user_project_files",
        filter: `user_id=eq.${user.id} AND project_id=eq.${projectId}`,
      },
      (payload) => {
        queryClient.setQueryData(
          getUserScoreQueryKey(user?.id || undefined, projectId),
          (oldData: any) => ({
            ...oldData,
            contribution_score: payload.new.contribution_score,
          })
        );
      }
    );

    // New file uploads for the project
    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "user_project_files",
        filter: `project_id=eq.${projectId}`,
      },
      (payload) => {
        queryClient.invalidateQueries({
          queryKey: getProjectFilesQueryKey(projectId),
        });
      }
    );

    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("Subscribed to realtime changes");
      }
      if (status === "CLOSED") {
        console.log("Realtime subscription closed");
      }
      if (status === "CHANNEL_ERROR") {
        console.error("Error in realtime subscription");
      }
    });

    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, user?.id, queryClient]);

  return {
    userId: user?.id,
    projectId,
  };
};
