"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { getProjectFilesQueryKey, getUserScoreQueryKey } from "../queryKeys";
import { useParamHelper } from "./useParamHelper";

const supabase = createClient();

export const useRealtime = () => {
  const { projectId, userId } = useParamHelper();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;
    // Create a single channel for all subscriptions
    const channel = supabase.channel("db-changes");

    // User's own contribution score
    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "user_project_files",
        filter: `user_id=eq.${userId} AND project_id=eq.${projectId}`,
      },
      (payload) => {
        queryClient.setQueryData(
          getUserScoreQueryKey(projectId),
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
  }, [projectId, userId, queryClient]);

  //   return back the userId and projectId to be reused
  return {
    userId: userId,
    projectId,
  };
};
