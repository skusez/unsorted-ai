"use client";

import { useQuery } from "@tanstack/react-query";
import { useRealtime } from "./hooks/useRealtime";
import {
  getProjectFilesQueryKey,
  getProjectQueryKey,
  getUserScoreQueryKey,
} from "./queryKeys";
import { getProject, getProjectFiles, getUserScore } from "./actions";

export const ProjectPageClient = () => {
  const { projectId, userId } = useRealtime();

  const project = useQuery({
    queryKey: getProjectQueryKey(projectId),
    queryFn: () => getProject(projectId),
    enabled: !!projectId,
  });

  const userScore = useQuery({
    queryKey: getUserScoreQueryKey(userId!, projectId),
    queryFn: () => getUserScore(userId!, projectId),
    enabled: !!userId && !!projectId,
  });

  const projectFiles = useQuery({
    queryKey: getProjectFilesQueryKey(projectId),
    queryFn: () => getProjectFiles(projectId),
    enabled: !!projectId,
  });

  return (
    <pre>
      {JSON.stringify(
        {
          project: project.data,
          userScore: userScore.data,
          projectFiles: projectFiles.data,
        },
        null,
        2
      )}
    </pre>
  );
};
