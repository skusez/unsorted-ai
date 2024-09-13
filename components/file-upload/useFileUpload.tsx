import { useState } from "react";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

type UploadFileFn = (formData: FormData) => Promise<any>;

interface UseFileUploadOptions<TUploadFn extends UploadFileFn> {
  uploadFn: TUploadFn;
  mutationOptions?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<TUploadFn>>,
      Error,
      FormData,
      unknown
    >,
    "mutationFn"
  >;
  additionalData?: Record<string, string>;
}

export const useFileUpload = <TUploadFn extends UploadFileFn>({
  uploadFn,
  mutationOptions = {},
  additionalData = {},
}: UseFileUploadOptions<TUploadFn>) => {
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      if (!file) throw new Error("No file selected");
      formData.append("file", file);
      for (const [key, value] of Object.entries(additionalData)) {
        formData.append(key, value);
      }
      return uploadFn(formData);
    },
    onSuccess: (data, variables, context) => {
      mutationOptions.onSuccess?.(data, variables, context);
      setFile(null);
    },
    ...mutationOptions,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData(e.target as HTMLFormElement);
    toast.promise(mutation.mutateAsync(formData), {
      loading: "Uploading...",
      success: "Uploaded successfully",
      error: "Upload failed",
    });
  };

  return {
    file,
    handleFileChange,
    handleUpload,
    isUploading: mutation.isPending,
    uploadError: mutation.error,
  };
};
