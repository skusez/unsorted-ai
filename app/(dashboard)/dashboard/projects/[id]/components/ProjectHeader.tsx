"use client";
import { useQuery } from "@tanstack/react-query";
import { getProject } from "../actions";
import { getProjectQueryKey } from "../queryKeys";
import { useParamHelper } from "../hooks/useParamHelper";
import { Skeleton } from "@/components/ui/skeleton";
import { FileIcon, CircleCheckIcon } from "lucide-react";

export const ProjectHeader = () => {
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
    return <ProjectHeaderSkeleton />;
  }

  if (error) return <div>Error loading project: {error.message}</div>;
  if (!project) return <div>No project data available</div>;

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
          <div>
            <img
              src="/placeholder.svg"
              width="600"
              height="400"
              alt="Project"
              className="w-full rounded-lg object-cover"
              style={{ aspectRatio: "600/400", objectFit: "cover" }}
            />
          </div>
          <div className="grid gap-4">
            <div>
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Project
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                {project.name}
              </h1>
            </div>
            <div className="grid gap-2">
              <p className="text-muted-foreground">
                {project.description?.toString()}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <FileIcon className="w-4 h-4" />
                  <span>24 Files</span>
                </div>
                <div className="flex items-center gap-1">
                  <CircleCheckIcon className="w-4 h-4 text-green-500" />
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectHeaderSkeleton = () => (
  <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
    <div className="container px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <div className="grid gap-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  </section>
);
