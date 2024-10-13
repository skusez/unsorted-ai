"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  User,
  MoreVertical,
  BarChart3,
  Cpu,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts";
import React from "react";
import { createClient } from "@/utils/supabase/client";
import { Enums, Tables } from "@/database.types";
import Image from "@/components/ui/image";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Header } from "../../Header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const chartConfig = {
  total: {
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

interface SearchAndPageSizeProps {
  pageSize: number;
  setPageSize: (value: number) => void;
  status: Enums<"project_status"> | undefined;
  setStatus: (value: Enums<"project_status"> | undefined) => void;
}

const SearchAndPageSize: React.FC<SearchAndPageSizeProps> = ({
  pageSize,
  setPageSize,
  status,
  setStatus,
}) => (
  <div className="flex flex-col gap-4 mb-6">
    <div className="flex items-center gap-2">
      <Select
        value={status}
        onValueChange={(value) => setStatus(value as Enums<"project_status">)}
      >
        <SelectTrigger className="w-32 border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(
            [
              "Active",
              "Proposed",
              "Training",
              "Complete",
            ] as Enums<"project_status">[]
          ).map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

const HeroSection = () => {
  const chartdata = [
    { name: "00:00", total: 1300 },
    { name: "01:00", total: 1100 },
    { name: "02:00", total: 900 },
    { name: "03:00", total: 800 },
    { name: "04:00", total: 800 },
    { name: "05:00", total: 1000 },
    { name: "06:00", total: 1500 },
    { name: "07:00", total: 2200 },
    { name: "08:00", total: 2700 },
    { name: "09:00", total: 3000 },
    { name: "10:00", total: 3200 },
    { name: "11:00", total: 3100 },
    { name: "12:00", total: 3000 },
    { name: "13:00", total: 3200 },
    { name: "14:00", total: 3300 },
    { name: "15:00", total: 3400 },
    { name: "16:00", total: 3500 },
    { name: "17:00", total: 3300 },
    { name: "18:00", total: 3000 },
    { name: "19:00", total: 2600 },
    { name: "20:00", total: 2200 },
    { name: "21:00", total: 2000 },
    { name: "22:00", total: 1700 },
    { name: "23:00", total: 1500 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Contributions
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">322,345</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Devices Registered
          </CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,241,573</div>
          <p className="text-xs text-muted-foreground">
            +12.5% from last month
          </p>
        </CardContent>
      </Card>
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            24h Data Contributions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="sm:w-full h-[200px]">
            <BarChart accessibilityLayer data={chartdata}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />

              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill="var(--color-total)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

const ProjectSelectionSection = ({
  allProjects,
}: {
  allProjects: Tables<"project_statistics">[];
}) => {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedTargetProject, setSelectedTargetProject] = useState<
    string | null
  >(null);

  // Mock data for demonstration purposes
  const sourceProjects = allProjects.slice(0, 5);

  const handleSourceProjectSelect = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleTargetProjectSelect = (projectId: string) => {
    setSelectedTargetProject(projectId);
  };

  const handleTrain = () => {
    console.log(
      "Training with source projects:",
      selectedProjects,
      "and target project:",
      selectedTargetProject
    );
    // Implement the actual training logic here
  };

  const aimodels = [
    { model_id: "1", model_name: "ge-mini", dimensions: "384x384" },
    { model_id: "2", model_name: "tz-1.5-flash", dimensions: "1024x1024" },
    { model_id: "3", model_name: "tz-1.5-pro", dimensions: "1792x1792" },
    { model_id: "4", model_name: "llama-3-70b-instruct", dimensions: "70x70" },
    { model_id: "5", model_name: "llama-3-8b-instruct", dimensions: "8x8" },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Train AI Model</h2>
      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Data Set</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead>Project Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sourceProjects.map((project) => (
                  <TableRow key={project.project_id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProjects.includes(
                          project.project_id || ""
                        )}
                        onCheckedChange={() =>
                          handleSourceProjectSelect(project.project_id || "")
                        }
                      />
                    </TableCell>
                    <TableCell>{project.project_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">AI Model</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead>Model Name</TableHead>
                  <TableHead>Dimensions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aimodels.map((model) => (
                  <TableRow key={model.model_id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTargetProject === model.model_id}
                        onCheckedChange={() =>
                          handleTargetProjectSelect(model.model_id || "")
                        }
                      />
                    </TableCell>
                    <TableCell>{model.model_name}</TableCell>
                    <TableCell>{model.dimensions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <Button
        onClick={handleTrain}
        className="mt-4 w-full md:w-auto"
        disabled={selectedProjects.length === 0 || !selectedTargetProject}
      >
        Train Model
      </Button>
    </div>
  );
};

export default function ProjectCards() {
  const supabase = createClient();
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState<Enums<"project_status"> | undefined>(
    "Active"
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["projects", search, pageSize, status],
      queryFn: async ({ pageParam = undefined }) => {
        const { data, error } = await supabase
          .rpc("get_paginated_projects", {
            p_search: search,
            p_page_size: pageSize,
            p_cursor: pageParam,
            ...(status ? { p_status: status } : {}),
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <Header setSearch={setSearch} />
        <HeroSection />
        <h3 className="text-xl font-semibold mb-2">Data sets</h3>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : allProjects.length === 0 ? (
          <NoDataFound />
        ) : (
          <>
            {!isExpanded ? (
              <ScrollArea className="sm:w-full sm:max-w-full max-w-sm whitespace-nowrap rounded-md">
                <div className="flex p-4 space-x-4">
                  {allProjects.map((project) => (
                    <div
                      key={project.project_id}
                      onClick={() =>
                        router.push(`/dashboard/projects/${project.project_id}`)
                      }
                      className="cursor-pointer flex-shrink-0 w-64 sm:w-72"
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for project: ${project.project_name}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          router.push(
                            `/dashboard/projects/${project.project_id}`
                          );
                        }
                      }}
                    >
                      <div className="mb-2">
                        <Image
                          src={
                            project.project_image ||
                            "https://source.unsplash.com/random/?abstract"
                          }
                          alt={project.project_name || "Project image"}
                          width={256}
                          height={144}
                          className="object-cover rounded-lg aspect-video w-full"
                        />
                      </div>
                      <div className="flex items-start mb-2">
                        <div className="flex-grow overflow-hidden">
                          <h3 className="font-semibold text-base mb-1 truncate">
                            {project.project_name}
                          </h3>
                          <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                            {(project.description as any)?.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 flex-shrink-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <User className="h-3 w-3 mr-1" />
                        <span className="mr-3">
                          {(project.contributor_count || 1 + 100) *
                            Math.floor(Math.random() * 100)}{" "}
                          contributors
                        </span>
                        <span>
                          {formatDistanceToNow(
                            new Date(project.created_at || ""),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allProjects.map((project) => (
                  <div
                    key={project.project_id}
                    onClick={() =>
                      router.push(`/dashboard/projects/${project.project_id}`)
                    }
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for project: ${project.project_name}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        router.push(
                          `/dashboard/projects/${project.project_id}`
                        );
                      }
                    }}
                  >
                    <div className="mb-2">
                      <Image
                        src={
                          project.project_image ||
                          "https://source.unsplash.com/random/?abstract"
                        }
                        alt={project.project_name || "Project image"}
                        width={256}
                        height={144}
                        className="object-cover rounded-lg aspect-video w-full"
                      />
                    </div>
                    <div className="flex items-start mb-2">
                      <div className="flex-grow overflow-hidden">
                        <h3 className="font-semibold text-base mb-1 truncate">
                          {project.project_name}
                        </h3>
                        <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                          {(project.description as any)?.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 flex-shrink-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      <span className="mr-3">
                        {(project.contributor_count || 1 + 100) *
                          Math.floor(Math.random() * 100)}{" "}
                        contributors
                      </span>
                      <span>
                        {formatDistanceToNow(
                          new Date(project.created_at || ""),
                          {
                            addSuffix: true,
                          }
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              onClick={toggleExpand}
              variant="ghost"
              className="mt-4 mx-auto w-full sm:w-auto"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" /> Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" /> Expand
                </>
              )}
            </Button>
          </>
        )}

        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetching}
            className="mt-4 w-full sm:w-auto"
          >
            {isFetching ? "Loading..." : "Load More"}
          </Button>
        )}

        <ProjectSelectionSection allProjects={allProjects} />
      </div>
    </div>
  );
}
