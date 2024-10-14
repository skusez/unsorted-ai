"use client";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CanvasDraw from "react-canvas-draw";
import {
  For,
  observer,
  useComputed,
  useObservable,
} from "@legendapp/state/react";
import { Observable, ObservablePrimitive } from "@legendapp/state";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

const MAX_DRAWINGS = 2;
interface DrawingModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  userId: string;
}
type Drawing = {
  saveState: string | null;
  dataUrl: string;
};
const DrawingModal: React.FC<DrawingModalProps> = ({
  isOpen,
  onClose,
  projectId,
  userId,
}) => {
  const drawingState$ = useObservable({
    api: null as CarouselApi | null,
    current: 0,
    count: 0,
  });

  const supabase = createClient();
  const queryClient = useQueryClient();

  const onSubmit = useMutation({
    mutationFn: async () => {
      const processedDrawings = await Promise.all(
        drawings$.get().map(async (drawing, index) => {
          // Create a temporary canvas to manipulate the image
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const img = new Image();

          // Load the image
          await new Promise((resolve) => {
            img.onload = resolve;
            img.src = drawing.dataUrl;
          });

          // Resize to 28x28
          canvas.width = 28;
          canvas.height = 28;
          ctx!.drawImage(img, 0, 0, 28, 28);

          // Invert colors
          const imageData = ctx!.getImageData(0, 0, 28, 28);
          for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = 255 - imageData.data[i];
            imageData.data[i + 1] = 255 - imageData.data[i + 1];
            imageData.data[i + 2] = 255 - imageData.data[i + 2];
          }
          ctx!.putImageData(imageData, 0, 0);

          // Convert to blob
          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob(resolve as BlobCallback, "image/png")
          );

          // Create a viewable URL for debugging
          const debugImageUrl = URL.createObjectURL(blob);
          console.log(`Debug image ${index + 1} URL:`, debugImageUrl);

          // Prepare FormData for upload
          const formData = new FormData();
          formData.append("image", blob, `${index + 1}.png`);
          // formData.append("number", (index + 1).toString());

          // Send to localhost:8000
          try {
            const response = await fetch(
              // "http://127.0.0.1:8000/upload-image-and-number/",
              "https://api.api-ninjas.com/v1/imagetotext",
              {
                method: "POST",
                body: formData,
              }
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(`Image ${index + 1} uploaded successfully:`, data);
            return `Image ${index + 1} uploaded`;
          } catch (error) {
            console.error(`Error uploading image ${index + 1}:`, error);
            throw error;
          }
        })
      );

      return processedDrawings;
    },
  });

  const drawingApi = drawingState$.api.get();
  useEffect(() => {
    if (!drawingApi) {
      return;
    }

    drawingState$.count.set(drawingApi.scrollSnapList?.()?.length || 0);

    drawingApi.on?.("select", () => {
      drawingState$.current.set((drawingApi.selectedScrollSnap?.() || 0) + 1);
    });
  }, [drawingApi]);

  const drawings$ = useObservable<Drawing[]>([
    { saveState: null, dataUrl: "" },
  ]);

  console.log({ drawings: drawings$.get() });
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col items-center justify-center">
        <DialogHeader>
          <DialogTitle>
            {(drawingState$.current.get() || 1) <= MAX_DRAWINGS
              ? `Draw the number ${drawingState$.current.get() || 1}`
              : "Summary"}
          </DialogTitle>
        </DialogHeader>
        <Carousel
          className="flex items-center justify-center w-[320px]"
          opts={{
            dragFree: true,
            watchDrag: false,
          }}
          setApi={drawingState$.api.set}
        >
          <CarouselContent>
            {drawings$.get().map((drawing, index) => (
              <CarouselItem key={index}>
                <Card className="border-none">
                  <CardContent className="flex aspect-square items-center justify-center">
                    <DrawImage id={index.toString()} drawings$={drawings$} />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
            {drawingState$.count.get() <= MAX_DRAWINGS && (
              <CarouselItem>
                <Card className="border-none">
                  <CardContent className="flex flex-wrap gap-4">
                    <For each={drawings$}>
                      {(drawing, index) => (
                        <div key={index}>
                          <img
                            className="aspect-square w-24"
                            src={drawing.dataUrl.get()}
                          />
                        </div>
                      )}
                    </For>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => {
                        toast.promise(onSubmit.mutateAsync(), {
                          loading: "Saving...",
                          success: "Saved!",
                          error: "Error saving",
                        });
                      }}
                    >
                      Save
                    </Button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

const DrawImage = ({
  drawings$,
  id,
}: {
  drawings$: Observable<Drawing[]>;
  id: string | undefined;
}) => {
  let canvasRef = useRef<CanvasDraw | null>(null);
  useEffect(() => {
    if (canvasRef.current) {
      console.log("canvasRef current");
      if (drawings$ && id !== undefined) {
        const saveData = drawings$[id as any].saveState.get();
        if (typeof saveData === "string") {
          console.log("loadSaveData", !!saveData, { id });
          canvasRef.current.loadSaveData(saveData, true);
        }
      }
    }
  }, []);

  console.log({ id });
  return (
    <div>
      <CanvasDraw
        ref={(ref) => (canvasRef.current = ref)}
        brushColor="black"
        brushRadius={8}
        canvasWidth={256}
        canvasHeight={256}
        hideGrid
        backgroundColor="white"
        onChange={(canvas: CanvasDraw) => {
          drawings$[id as any].saveState.set(canvas.getSaveData());
          drawings$[id as any].dataUrl.set(
            // @ts-ignore: Unreachable code error
            canvas.getDataURL("png", false, "#ffffff")
          );

          if (
            parseInt(id as any) === drawings$.get().length - 1 &&
            drawings$.get().length < MAX_DRAWINGS
          ) {
            // add a new empty drawing
            drawings$.set([
              ...drawings$.get(),
              { saveState: null, dataUrl: "" },
            ]);
          }
        }}
      />
      <Button
        onClick={() => {
          canvasRef.current?.clear();
        }}
      >
        Clear
      </Button>
    </div>
  );
};

export default observer(DrawingModal);
