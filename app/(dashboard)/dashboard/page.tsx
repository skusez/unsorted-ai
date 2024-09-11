"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ExternalLink, Upload } from "lucide-react";
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

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["projects", search, pageSize],
      queryFn: async ({ pageParam = undefined }) => {
        const { data, error } = await supabase
          .rpc("get_paginated_projects", {
            p_search: search,
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
              key={project.project_id}
              className="h-[300px] relative overflow-hidden"
            >
              <img
                src={project.project_image || undefined}
                alt={project.project_name || ""}
                className="absolute inset-0 w-full mask-image-gradient-to-b from-black to-80% h-full object-cover object-center opacity-80 pointer-events-none"
              />
              <div className="relative z-10 h-full flex flex-col">
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
                    <Button size={"icon"} variant={"ghost"} asChild>
                      <Link
                        href={`/dashboard/projects/${project.project_id}`}
                        prefetch={false}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 flex-grow">
                  <div className="text-sm text-muted-foreground h-20 overflow-y-auto">
                    {
                      (project.description as any).root.children[0].children[0]
                        .text
                    }
                  </div>
                  <div>
                    <span className="text-sm">
                      Participants: {project.contributor_count}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Uploaded: {project.file_count}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    asChild
                    variant={"link"}
                    size={"sm"}
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <Link
                      href={`/dashboard/projects/${project.project_id}/upload`}
                      prefetch={false}
                    >
                      <span>Contribute</span>
                      <Upload className="h-4 w-4" />
                    </Link>
                  </Button>
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
