import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useFileUpload } from "@/components/file-upload/useFileUpload";
import { uploadFile } from "@/app/(dashboard)/dashboard/projects/[id]/components/actions";

interface ProjectFileUploadProps {
  projectId: string;
  userId: string;
}

export const ProjectFileUpload: React.FC<ProjectFileUploadProps> = ({
  projectId,
  userId,
}) => {
  const queryClient = useQueryClient();

  const { file, handleFileChange, handleUpload, isUploading, uploadError } =
    useFileUpload({
      uploadFn: uploadFile,
      mutationOptions: {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
        },
      },
      additionalData: {
        projectId,
        userId,
      },
    });

  return (
    <form className="space-y-4" onSubmit={handleUpload}>
      <div>
        <Label htmlFor="file-upload">Choose a file</Label>
        <Input
          id="file-upload"
          type="file"
          name="file"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <Input
          type="hidden"
          name="projectId"
          value={projectId}
          disabled={isUploading}
        />
        <Input
          type="hidden"
          name="userId"
          value={userId}
          disabled={isUploading}
        />
      </div>
      <Button type="submit" disabled={!file || isUploading}>
        {isUploading ? "Uploading..." : "Upload File"}
      </Button>
      {uploadError && <p className="text-red-500">{uploadError.message}</p>}
    </form>
  );
};
