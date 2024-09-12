"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  CalendarPlusIcon,
  FileText,
  PenBox,
  UploadIcon,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/database.types";
import { useDebounce } from "use-debounce";
import Image from "@/components/ui/image";
import { toGigabytes } from "@/utils/utils";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

const CardSkeleton = () => (
  <Card className="w-full h-[300px]">
    <CardHeader>
      <Skeleton className="h-4 w-2/3" />
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-8 w-24" />
    </CardFooter>
  </Card>
);

const NoDataFound = () => (
  <div className="text-center py-10">
    <p className="text-muted-foreground">
      No projects found. Try adjusting your search criteria.
    </p>
  </div>
);

interface SearchAndPageSizeProps {
  search: string;
  setSearch: (value: string) => void;
  pageSize: number;
  setPageSize: (value: number) => void;
}

const SearchAndPageSize: React.FC<SearchAndPageSizeProps> = ({
  search,
  setSearch,
  pageSize,
  setPageSize,
}) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
    <Input
      placeholder="Search projects..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full sm:max-w-md"
    />
    <div className="flex items-center gap-2">
      <Label htmlFor="page-size">Show</Label>
      <Select
        value={pageSize.toString()}
        onValueChange={(value) => setPageSize(Number(value))}
      >
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[10, 20, 50, 100].map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Label htmlFor="page-size">entries</Label>
    </div>
  </div>
);

export default function ProjectCards() {
  const supabase = createClient();
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const [searchDebounced] = useDebounce(search, 500);
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["projects", searchDebounced, pageSize],
      queryFn: async ({ pageParam = undefined }) => {
        const { data, error } = await supabase
          .rpc("get_paginated_projects", {
            p_search: searchDebounced,
            p_page_size: pageSize,
            p_cursor: pageParam,
          })
          .returns<{
            next_cursor: string | null;
            projects: Tables<"project_statistics">[];
          }>();
        if (error) {
          throw error;
        }
        return data;
      },
      initialPageParam: undefined,
      getNextPageParam: (lastPage: { next_cursor: string | null }) =>
        lastPage.next_cursor,
    });

  const allProjects = data?.pages.flatMap((page) => page.projects) ?? [];

  const TooltipWithIcon = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode | null;
  }) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-1">
            {icon}
            <span>{value}</span>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <SearchAndPageSize
        search={search}
        setSearch={setSearch}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : allProjects.length === 0 ? (
        <NoDataFound />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProjects.map((project) => (
            <Card
              onClick={() =>
                router.push(`/dashboard/projects/${project.project_id}`)
              }
              key={project.project_id}
              role="button"
              tabIndex={0}
              aria-label={`View details for project: ${project.project_name}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  router.push(`/dashboard/projects/${project.project_id}`);
                }
              }}
              className="h-[300px] relative cursor-pointer overflow-hidden"
            >
              <Image
                src={
                  project.project_image ||
                  "https://source.unsplash.com/random/?abstract"
                }
                alt={project.project_name || "Project image"}
                fill
                className="object-cover object-center opacity-50 pointer-events-none"
              />
              <div className="relative z-10 h-full flex flex-col bg-gradient-to-t from-background/80 to-background/20">
                <CardHeader>
                  <CardTitle className="flex justify-between ">
                    <div className="flex flex-col gap-2">
                      {project.project_name}
                      <Badge
                        className="w-fit"
                        variant={
                          project.status === "Complete"
                            ? "secondary"
                            : project.status === "Active"
                              ? "outline"
                              : "default"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <Button variant={"ghost"} asChild>
                      <Link
                        href={`/dashboard/projects/${project.project_id}`}
                        prefetch={false}
                        className="flex z-10 items-center gap-2"
                      >
                        Contribute <UploadIcon className="size-4" />
                      </Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 h-full flex flex-col justify-between">
                  <div className="text-sm text-muted-foreground h-12 overflow-y-auto">
                    {
                      (project.description as any).root.children[0].children[0]
                        .text
                    }
                  </div>

                  <Separator />
                  <div className="flex-1 flex flex-col justify-center space-y-2">
                    <div className="flex text-sm font-bold justify-between">
                      <div className="inline-flex items-center text-muted-foreground space-x-2">
                        <TooltipWithIcon
                          icon={<User className="size-4" />}
                          label="Contributors"
                          value={project.contributor_count}
                        />
                        <TooltipWithIcon
                          icon={<FileText className="size-4" />}
                          label="Files"
                          value={project.file_count}
                        />
                      </div>
                      <TooltipWithIcon
                        icon={<PenBox className="size-4" />}
                        label="Average Contribution Score"
                        value={`${(project.avg_contribution_score || 0).toFixed(2)}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground inline-flex items-center justify-between w-full text-xs">
                        <span>Progress</span>
                        <div>
                          {toGigabytes(project.current_data_usage || 0)} GB /{" "}
                          {toGigabytes(project.data_limit || 1)} GB
                        </div>
                      </Label>
                      <Progress
                        value={Math.min(
                          100,
                          ((project.current_data_usage || 0) /
                            (project.data_limit || 1)) *
                            100
                        )}
                        // Comment: Calculate progress percentage, capped at 100%
                        className="h-2"
                      />
                    </div>
                  </div>
                  {/* <div>
                    <div>
                      <span className="text-sm">
                        Participants: {project.contributor_count}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Uploaded: {project.file_count}
                    </p>
                  </div>
                  Data usage progress */}
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground justify-end">
                  {/* human readable date */}
                  <TooltipWithIcon
                    icon={<CalendarPlusIcon className="size-4" />}
                    label="Created at"
                    value={new Date(project.created_at || "").toLocaleString(
                      undefined,
                      {
                        year: "2-digit",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  />
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      )}

      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetching}
          className="mt-4"
        >
          {isFetching ? "Loading..." : "Load More"}
        </Button>
      )}
    </div>
  );
}
