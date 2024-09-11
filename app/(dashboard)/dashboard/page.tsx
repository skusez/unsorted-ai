"use client";
// TODO use the database view to fetch projects & data
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
type Project = {
  id: number;
  image: string;
  name: string;
  description: string;
  participants: number;
  uploaded: string;
  status: "Completed" | "In Progress" | "Pending";
};

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

const fetchProjects = async ({ pageParam = 0 }) => {
  // Simulating API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const projects = [
    {
      id: 1,
      image: "/placeholder.svg",
      name: "Project Omega",
      description: JSON.stringify({
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "A revolutionary new product that will change the world.",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }),
      participants: 12,
      uploaded: "2023-04-15",
      status: "In Progress",
    },
    {
      id: 2,
      image: "/placeholder.svg",
      name: "Acme Innovations",
      description: JSON.stringify({
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "Cutting-edge technology for the modern enterprise.",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }),
      participants: 8,
      uploaded: "2023-02-28",
      status: "Completed",
    },
    {
      id: 3,
      image: "/placeholder.svg",
      name: "Stellar Solutions",
      description: JSON.stringify({
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "Transforming the way we think about problem-solving.",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }),
      participants: 15,
      uploaded: "2023-07-01",
      status: "In Progress",
    },
    {
      id: 4,
      image: "/placeholder.svg",
      name: "Quantum Leap",
      description: JSON.stringify({
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "Pushing the boundaries of what's possible.",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }),
      participants: 6,
      uploaded: "2023-09-01",
      status: "Pending",
    },
    {
      id: 5,
      image: "/placeholder.svg",
      name: "Horizon Enterprises",
      description: JSON.stringify({
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "Redefining the future of business.",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }),
      participants: 20,
      uploaded: "2023-05-20",
      status: "Completed",
    },
  ];
  return {
    projects: projects.slice(pageParam, pageParam + 10),
    nextCursor: pageParam + 10 < projects.length ? pageParam + 10 : undefined,
  };
};

export default function ProjectCards() {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["projects", search, pageSize],
      queryFn: fetchProjects,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: 0,
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
              key={project.id}
              className="h-[300px] relative overflow-hidden"
            >
              <img
                src={project.image}
                alt={project.name}
                className="absolute inset-0 w-full mask-image-gradient-to-b from-black to-80% h-full object-cover object-center opacity-80 pointer-events-none"
              />
              <div className="relative z-10 h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex justify-between ">
                    <div className="flex flex-col gap-2">
                      {project.name}
                      <Badge
                        className="w-fit"
                        variant={
                          project.status === "Completed"
                            ? "secondary"
                            : project.status === "In Progress"
                              ? "outline"
                              : "default"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <Button size={"icon"} variant={"ghost"} asChild>
                      <Link
                        href={`/dashboard/projects/${project.id}`}
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
                      JSON.parse(project.description).root.children[0]
                        .children[0].text
                    }
                  </div>
                  <div>
                    <span className="text-sm">
                      Participants: {project.participants}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Uploaded: {project.uploaded}
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
                      href={`/dashboard/projects/${project.id}/upload`}
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
