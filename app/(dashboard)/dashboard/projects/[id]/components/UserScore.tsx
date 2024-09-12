import { useQuery } from "@tanstack/react-query";
import { getUserScore } from "../actions";
import { getUserScoreQueryKey } from "../queryKeys";
import { Skeleton } from "@/components/ui/skeleton";
import { useParamHelper } from "../hooks/useParamHelper";

export const UserScore = () => {
  const { userId, projectId } = useParamHelper();
  const {
    data: score,
    isLoading,
    error,
  } = useQuery({
    queryKey: getUserScoreQueryKey(userId!, projectId),
    queryFn: () => getUserScore(userId!, projectId),
    enabled: !!userId && !!projectId,
  });

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mt-4">
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-8 w-1/4" />
      </div>
    );
  }

  if (error) return <div>Error loading score: {error.message}</div>;
  if (score === null) return <div>No score available</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4">
      <h3 className="text-xl font-semibold mb-2">Your Contribution Score</h3>
      <p className="text-3xl font-bold text-blue-600">{score}</p>
    </div>
  );
};
