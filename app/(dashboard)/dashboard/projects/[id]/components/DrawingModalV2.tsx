"use client";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { For, observer, useObservable } from "@legendapp/state/react";
import { Observable, ObservablePrimitive } from "@legendapp/state";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

const MAX_DRAWINGS = 4;
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
function extractNumbersFromParsedText(
  parsedText: string,
  expectedCount: number
): (number | null)[] {
  let numbers: (number | null)[] = [];

  for (let i = 1; i < expectedCount + 1; i++) {
    if (parsedText.includes(i.toString())) {
      numbers.push(i);
    } else if ([1, 10].includes(i)) {
      if (parsedText.includes("L")) {
        numbers.push(i);
      }
    } else {
      numbers.push(null);
    }
  }

  return numbers;
}
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

  const [showSummary, setShowSummary] = useState(false);
  const [parsedNumbers, setParsedNumbers] = useState<(number | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  const onSubmit = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      // Create a temporary canvas to stitch images horizontally
      const stitchCanvas = document.createElement("canvas");
      const stitchCtx = stitchCanvas.getContext("2d");
      const drawingCount = drawings$.get().length;

      stitchCanvas.width = 128 * drawingCount;
      stitchCanvas.height = 128;

      for (let i = 0; i < drawingCount; i++) {
        const drawing = drawings$.get()[i];
        const img = new Image();
        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = drawing.dataUrl;
        });

        // Create a temporary canvas for each image
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = 128;
        tempCanvas.height = 128;

        // Resize and invert colors
        tempCtx!.drawImage(img, 0, 0, 128, 128);
        const imageData = tempCtx!.getImageData(0, 0, 128, 128);
        for (let j = 0; j < imageData.data.length; j += 4) {
          imageData.data[j] = 255 - imageData.data[j];
          imageData.data[j + 1] = 255 - imageData.data[j + 1];
          imageData.data[j + 2] = 255 - imageData.data[j + 2];
        }
        tempCtx!.putImageData(imageData, 0, 0);

        // Draw the processed image onto the stitched canvas horizontally
        stitchCtx!.drawImage(tempCanvas, i * 128, 0);
      }

      // Convert the stitched canvas to a blob
      const stitchedBlob = await new Promise<Blob>((resolve) =>
        stitchCanvas.toBlob(resolve as BlobCallback, "image/png")
      );

      // Create a debug URL for the stitched image
      const debugImageUrl = URL.createObjectURL(stitchedBlob);
      console.log("Debug stitched image URL:", debugImageUrl);

      // Prepare FormData for upload
      const formData = new FormData();
      formData.append("filetype", "PNG");
      formData.append("file", stitchedBlob, "stitched.png");
      formData.append(
        "apikey",
        process.env.NEXT_PUBLIC_OCR_SPACE_API_KEY as string
      );

      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          const response = await fetch("https://api.ocr.space/parse/image", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Stitched image uploaded successfully:", data);

          if (data.ParsedResults[0].ParsedText === "") {
            throw new Error("Empty response from OCR API");
          }

          const parsedText = data.ParsedResults[0].ParsedText;
          const numbers = extractNumbersFromParsedText(
            parsedText,
            drawingCount
          );
          console.log("Extracted numbers:", numbers);
          setParsedNumbers(numbers);
          setShowSummary(true);
          setIsLoading(false);

          // save result to supabase

          return "Stitched image uploaded";
        } catch (error) {
          console.error(
            `Error uploading stitched image (attempt ${retries + 1}):`,
            error
          );
          retries++;
          if (retries >= MAX_RETRIES) {
            setIsLoading(false);
            toast.error("Experiencing network issues. Please try again later.");
            throw error;
          }
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        }
      }
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
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex flex-col h-[450px] overflow-y-auto items-center justify-center">
          <DialogHeader>
            <DialogTitle>
              {(drawingState$.current.get() || 1) <= MAX_DRAWINGS
                ? `Draw the number ${drawingState$.current.get() || 1}`
                : "Summary"}
            </DialogTitle>
          </DialogHeader>
          <Carousel
            className="flex items-center  justify-center w-[320px]"
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
                  <Card className="border-none ">
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
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Save"
                        )}
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

      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Drawing Summary</DialogTitle>
            <DialogDescription>
              Here's a summary of your drawings and the parsed results:
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4">
            {drawings$.get().map((drawing, index) => (
              <div key={index} className="text-center">
                <img
                  src={drawing.dataUrl}
                  alt={`Drawing ${index + 1}`}
                  className="w-24 h-24 mx-auto mb-2"
                />
                <p
                  className={
                    parsedNumbers[index] !== null
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {parsedNumbers[index] !== null
                    ? `Good: ${parsedNumbers[index]}`
                    : "Bad: Not recognized"}
                </p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSummary(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
        className="mx-auto w-full mt-2"
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
