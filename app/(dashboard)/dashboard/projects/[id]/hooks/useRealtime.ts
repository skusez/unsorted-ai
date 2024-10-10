"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import {
  getProjectFilesQueryKey,
  getUserScoreQueryKey,
  getProjectQueryKey,
} from "../queryKeys";
import { useParamHelper } from "./useParamHelper";

const supabase = createClient();

export function useRealtime() {
  const { projectId, userId } = useParamHelper();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!projectId || !userId) return;

    const channel = supabase.channel(`project-updates:${projectId}`);

    // Project updates
    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "projects",
        filter: `id=eq.${projectId}`,
      },
      (payload) => {
        queryClient.setQueryData(
          getProjectQueryKey(projectId),
          (oldData: any) => ({
            ...oldData,
            ...payload.new,
          })
        );
      }
    );

    // User's own contribution score
    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "user_project_files",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log(payload);
        if (payload.new.project_id === projectId) {
          queryClient.setQueryData(
            getUserScoreQueryKey(projectId),
            (oldData: number) => {
              return oldData + payload.new.contribution_score;
            }
          );
        }
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
      () => {
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

  return { userId, projectId };
}
