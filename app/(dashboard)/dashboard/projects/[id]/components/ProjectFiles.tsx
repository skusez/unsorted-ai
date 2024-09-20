import { useQuery } from "@tanstack/react-query";
import { getProjectFiles } from "../actions";
import { getProjectFilesQueryKey } from "../queryKeys";
import { Skeleton } from "@/components/ui/skeleton";
import { useParamHelper } from "../hooks/useParamHelper";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import DrawingModal from "./DrawingModal";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export const ProjectFiles = () => {
  const supabase = createClient();
  const { projectId, userId } = useParamHelper();
  const queryClient = useQueryClient();
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);

  const getProjectFiles = async () => {
    const { data, error } = await supabase.storage
      .from("projects")
      .list(`${projectId}/${userId}/`, {
        limit: 15,
        sortBy: { column: "name", order: "asc" },
      });
    if (error) {
      throw error;
    }
    return data.filter((file) => !file.name.startsWith("."));
  };

  const {
    data: files,
    isLoading,
    error,
  } = useQuery({
    queryKey: getProjectFilesQueryKey(projectId, userId!),
    queryFn: () => getProjectFiles(),
    enabled: !!projectId && !!userId,
  });

  const handleDownload = async (fileName: string) => {
    const { data, error } = await supabase.storage
      .from("projects")
      .download(`${projectId}/${userId}/${fileName}`);

    if (error) {
      toast.error(error.message);
      return;
    }

    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (fileName: string) => {
    const { error } = await supabase.storage
      .from("projects")
      .remove([`${projectId}/${userId}/${fileName}`]);

    if (error) {
      toast.error(error.message);
      return;
    }

    const currentNumber = fileName.split(".")[0];
    queryClient.removeQueries({
      queryKey: ["drawing", projectId, userId, Number(currentNumber)],
    });
    queryClient.setQueryData(
      getProjectFilesQueryKey(projectId, userId!),
      (oldData: any) => {
        return oldData.filter((file: any) => file.name !== fileName);
      }
    );
    toast.success(`${fileName} has been deleted successfully.`);
  };

  if (isLoading) {
    return <ProjectFilesSkeleton />;
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Drawings</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            This project requires you to submit drawings. Once submitted, you
            will receive a score.
          </CardDescription>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setIsDrawingModalOpen(true)}>
            Open Drawing
          </Button>
          <DrawingModal
            isOpen={isDrawingModalOpen}
            onClose={() => setIsDrawingModalOpen(false)}
            projectId={projectId}
            userId={userId!}
          />
        </CardFooter>
      </Card>
      {/* <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectFileUpload projectId={projectId} userId={userId!} />
        </CardContent>
      </Card> */}
      {error ? (
        <div>Error loading files: {error.message}</div>
      ) : !files || files.length === 0 ? (
        <div>No files available</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Files</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
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
                        <span>{file.name}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {new Date(file.created_at || "").toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(file.name)}
                        >
                          <DownloadIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(file.name)}
                        >
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
