"use client";
import { useQuery } from "@tanstack/react-query";
import { getProject } from "../actions";
import { getProjectQueryKey } from "../queryKeys";
import { useParamHelper } from "../hooks/useParamHelper";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileIcon,
  CircleCheckIcon,
  CircleXIcon,
  CircleDotIcon,
  GraduationCap,
} from "lucide-react";
import { Enums } from "@/database.types";
import { Fragment } from "react";

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
    refetchOnMount: false,
  });

  if (isLoading) {
    return <ProjectHeaderSkeleton />;
  }

  if (error) return <div>Error loading project: {error.message}</div>;
  if (!project) return <div>No project data available</div>;

  const renderStatusIcon = (status: Enums<"project_status">) => {
    switch (status) {
      case "Active":
        return <CircleCheckIcon className="w-4 h-4 text-green-500" />;
      case "Proposed":
        return <CircleDotIcon className="w-4 h-4 text-orange-500" />;
      case "Training":
        return <GraduationCap className="w-4 h-4 text-blue-500" />;
      default:
        return <Fragment></Fragment>;
    }
  };

  return (
    <section className="w-full py-4 md:py-6 lg:py-8 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
          <div>
            <img
              src={project.image_url || "/placeholder.svg"}
              width="600"
              height="400"
              alt="Project"
              className="w-1/2 rounded-lg object-cover"
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
                {(project.description as any)?.description}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <FileIcon className="w-4 h-4" />
                  <span>
                    {(project.file_count || 0 + 100) *
                      Math.floor(Math.random() * 1000)}{" "}
                    Contributions
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {renderStatusIcon(project.status)}
                  <span>{project.status}</span>
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
