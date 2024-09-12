import { useQuery } from "@tanstack/react-query";
import { getProject } from "../actions";
import { getProjectQueryKey } from "../queryKeys";
import { Tables } from "@/database.types";
import { Skeleton } from "@/components/ui/skeleton";
import { useParamHelper } from "../hooks/useParamHelper";

export const ProjectDetails = () => {
  const { projectId } = useParamHelper();
  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: getProjectQueryKey(projectId),
    queryFn: () => getProject(projectId),
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }

  if (error) return <div>Error loading project: {error.message}</div>;
  if (!project) return <div>No project data available</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
      <p className="text-gray-600">
        {(project.description as any).root.children[0].children[0].text}
      </p>
    </div>
  );
};
