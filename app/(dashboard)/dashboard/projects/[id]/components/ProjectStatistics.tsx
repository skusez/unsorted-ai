"use client";
import { useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProject, getUserScore } from "../actions";
import { getProjectQueryKey, getUserScoreQueryKey } from "../queryKeys";
import { useParamHelper } from "../hooks/useParamHelper";
import { Skeleton } from "@/components/ui/skeleton";
import { toGigabytes } from "@/utils/utils";
import { createClient } from "@/utils/supabase/client";

export const ProjectStatistics = () => {
  const { projectId } = useParamHelper();
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createClient(), []);
  const { data: project, isLoading } = useQuery({
    queryKey: getProjectQueryKey(projectId),
    queryFn: () => getProject(projectId),
    enabled: !!projectId,
    refetchOnMount: false,
  });

  const {
    data: score,
    isLoading: isUserScoreLoading,
    error,
  } = useQuery({
    queryKey: getUserScoreQueryKey(projectId),
    queryFn: () => getUserScore(projectId),
    enabled: !!projectId,
    refetchOnMount: false,
    retry: false,
  });

  if (isLoading) {
    return <StatisticsSkeleton />;
  }

  if (!project) {
    return <div>No project data available</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {isUserScoreLoading ? (
        <StatisticSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {score ? `${(100 - (score || 0)).toFixed(2)}%` : "N/A"}
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Total Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{project.file_count || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Data Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {toGigabytes(project.current_data_usage || 0)} GB
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Data Limit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {toGigabytes(project.data_limit || 0)} GB
          </div>
        </CardContent>
      </Card>
      {/* <Card>
        <CardHeader>
          <CardTitle>Avg. Contribution Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {project.avg_contribution_score?.toFixed(2) || '0.00'}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

const StatisticsSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[...Array(6)].map((_, i) => (
      <StatisticSkeleton key={i} />
    ))}
  </div>
);

const StatisticSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-24" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-10 w-20" />
    </CardContent>
  </Card>
);
