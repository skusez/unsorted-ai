import { useQuery } from "@tanstack/react-query";
import { getProjectFiles } from "../actions";
import { getProjectFilesQueryKey } from "../queryKeys";
import { Skeleton } from "@/components/ui/skeleton";
import { useParamHelper } from "../hooks/useParamHelper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileIcon, DownloadIcon, TrashIcon } from "lucide-react";
import { ProjectFileUpload } from "./FileUpload";

export const ProjectFiles = () => {
  const { projectId, userId } = useParamHelper();
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
    return <ProjectFilesSkeleton />;
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectFileUpload projectId={projectId} userId={userId!} />
        </CardContent>
      </Card>
      {error ? (
        <div>Error loading files: {error.message}</div>
      ) : !files || files.length === 0 ? (
        <div>No files available</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileIcon className="w-4 h-4" />
                        <span>{file.file_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>2.3 MB</TableCell>
                    <TableCell>
                      {new Date(file.created_at || "").toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <DownloadIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const ProjectFilesSkeleton = () => (
  <div className="grid gap-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-40 w-full" />
      </CardContent>
    </Card>
  </div>
);
