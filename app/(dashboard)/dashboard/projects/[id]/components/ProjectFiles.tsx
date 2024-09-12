import { useQuery } from "@tanstack/react-query";
import { getProjectFiles } from "../actions";
import { getProjectFilesQueryKey } from "../queryKeys";
import { Tables } from "@/database.types";
import { Skeleton } from "@/components/ui/skeleton";
import { useParamHelper } from "../hooks/useParamHelper";

interface ProjectFilesProps {
  projectId: string;
}

export const ProjectFiles = () => {
  const { userId, projectId } = useParamHelper();
  const {
    data: files,
    isLoading,
    error,
  } = useQuery({
    queryKey: getProjectFilesQueryKey(projectId),
    queryFn: () => getProjectFiles(projectId),
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mt-4">
        <Skeleton className="h-6 w-1/3 mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) return <div>Error loading files: {error.message}</div>;
  if (!files || files.length === 0) return <div>No files available</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4">
      <h3 className="text-xl font-semibold mb-4">Project Files</h3>
      <ul className="space-y-2">
        {files.map((file) => (
          <li key={file.id} className="flex items-center justify-between">
            <span>{file.file_name}</span>
            <span className="text-sm text-gray-500">
              {new Date(file.created_at || "").toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
