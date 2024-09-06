"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Eye, FilePen, Trash, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Project = {
  id: number;
  image: string;
  name: string;
  description: string;
  participants: number;
  uploaded: string;
  status: "Completed" | "In Progress" | "Pending";
};

const columnHelper = createColumnHelper<Project>();

const columns = [
  columnHelper.accessor("image", {
    header: "Image",
    cell: (info) => (
      <img
        src={info.getValue()}
        alt={info.row.original.name}
        width={64}
        height={64}
        className="rounded-md"
        style={{ aspectRatio: "64/64", objectFit: "cover" }}
      />
    ),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => (
      <span className="text-muted-foreground">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("participants", {
    header: "Participants",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("uploaded", {
    header: "Date Uploaded",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <Badge
        variant={
          info.getValue() === "Completed"
            ? "secondary"
            : info.getValue() === "In Progress"
              ? "outline"
              : "default"
        }
      >
        {info.getValue()}
      </Badge>
    ),
  }),
  columnHelper.display({
    id: "actions",
    cell: () => <ActionButtons />,
  }),
];

const ActionButtons = () => (
  <div className="flex items-center gap-2">
    <Button variant="ghost" size="icon">
      <Eye className="h-4 w-4" />
      <span className="sr-only">View</span>
    </Button>
    <Button variant="ghost" size="icon">
      <FilePen className="h-4 w-4" />
      <span className="sr-only">Edit</span>
    </Button>
    <Button variant="ghost" size="icon">
      <Trash className="h-4 w-4" />
      <span className="sr-only">Delete</span>
    </Button>
  </div>
);

const TableSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-md" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-6 w-[100px]" />
      </div>
    ))}
  </div>
);

const NoDataFound = () => (
  <div className="text-center py-10">
    <p className="text-muted-foreground">
      No projects found. Try adjusting your search criteria.
    </p>
  </div>
);

const SearchAndPageSize = ({ search, setSearch, pageSize, setPageSize }) => (
  <div className="flex items-center justify-between">
    <Input
      placeholder="Search projects..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="max-w-md"
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
      description: "A revolutionary new product that will change the world.",
      participants: 12,
      uploaded: "2023-04-15",
      status: "In Progress",
    },
    {
      id: 2,
      image: "/placeholder.svg",
      name: "Acme Innovations",
      description: "Cutting-edge technology for the modern enterprise.",
      participants: 8,
      uploaded: "2023-02-28",
      status: "Completed",
    },
    {
      id: 3,
      image: "/placeholder.svg",
      name: "Stellar Solutions",
      description: "Transforming the way we think about problem-solving.",
      participants: 15,
      uploaded: "2023-07-01",
      status: "In Progress",
    },
    {
      id: 4,
      image: "/placeholder.svg",
      name: "Quantum Leap",
      description: "Pushing the boundaries of what's possible.",
      participants: 6,
      uploaded: "2023-09-01",
      status: "Pending",
    },
    {
      id: 5,
      image: "/placeholder.svg",
      name: "Horizon Enterprises",
      description: "Redefining the future of business.",
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

export default function ProjectTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["projects", search, pageSize],
      queryFn: fetchProjects,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const allProjects = data?.pages.flatMap((page) => page.projects) ?? [];

  const table = useReactTable({
    data: allProjects,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => document.querySelector("#table-container"),
    estimateSize: () => 50,
    overscan: 10,
  });

  return (
    <div className="flex flex-col gap-4">
      <SearchAndPageSize
        search={search}
        setSearch={setSearch}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />

      {isLoading ? (
        <TableSkeleton />
      ) : allProjects.length === 0 ? (
        <NoDataFound />
      ) : (
        <div
          id="table-container"
          className="overflow-auto"
          style={{ height: "600px" }}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() && (
                        <span className="ml-1">
                          {header.column.getIsSorted() === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <TableRow key={row.id} data-index={virtualRow.index}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} disabled={isFetching}>
          {isFetching ? "Loading..." : "Load More"}
        </Button>
      )}
    </div>
  );
}
