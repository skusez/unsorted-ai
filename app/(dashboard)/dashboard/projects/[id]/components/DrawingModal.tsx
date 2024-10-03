"use client";
import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getProjectFilesQueryKey } from "../queryKeys";

interface DrawingModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  userId: string;
}

const DrawingModal: React.FC<DrawingModalProps> = ({
  isOpen,
  onClose,
  projectId,
  userId,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentNumber, setCurrentNumber] = useState(1);
  const [allDrawings, setAllDrawings] = useState<(File | null)[]>([]);
  const [hasDrawings, setHasDrawings] = useState<boolean[]>(
    Array(10).fill(false)
  );
  const canvasRefs = useRef<(CanvasDraw | null)[]>(Array(10).fill(null));
  const supabase = createClient();
  const queryClient = useQueryClient();

  const fetchDrawing = async (number: number): Promise<File> => {
    const { data: blob, error } = await supabase.storage
      .from("projects")
      .download(`${projectId}/${userId}/${number}.jpg`);

    if (error) {
      throw error;
    }
    // convert blob to file
    const file = new File([blob!], `${number}.jpg`, {
      type: "image/jpeg",
    });
    return file;
  };

  const { data: currentDrawing, isSuccess } = useQuery<File>({
    queryKey: ["drawing", projectId, userId, currentNumber],
    queryFn: () => fetchDrawing(currentNumber),
    enabled: isOpen && currentNumber <= 10,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess && currentDrawing) {
      setHasDrawings((prev) => {
        const newHasDrawings = [...prev];
        newHasDrawings[currentNumber - 1] = true;
        return newHasDrawings;
      });
    }
  }, [isSuccess, currentDrawing, currentNumber]);

  useEffect(() => {
    if (isOpen && currentNumber === 11) {
      loadAllDrawings();
    }
  }, [isOpen, currentNumber]);
  const loadAllDrawings = async () => {
    const drawings: (File | null)[] = [];
    for (let i = 1; i <= 10; i++) {
      const cachedDrawing = queryClient.getQueryData<File>([
        "drawing",
        projectId,
        userId,
        i,
      ]);
      if (cachedDrawing) {
        drawings.push(cachedDrawing);
      } else {
        try {
          const fetchedDrawing = await fetchDrawing(i);
          drawings.push(fetchedDrawing);
        } catch (error) {
          console.error(`Error fetching drawing ${i}:`, error);
          drawings.push(null);
        }
      }
    }
    setAllDrawings(drawings);
  };

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const newNumber = api.selectedScrollSnap() + 1;
      setCurrentNumber(newNumber);
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const handleClear = () => {
    const canvasRef = canvasRefs.current[currentNumber - 1];
    if (canvasRef) {
      canvasRef.clear();
      setHasDrawings((prev) => {
        const newHasDrawings = [...prev];
        newHasDrawings[currentNumber - 1] = false;
        return newHasDrawings;
      });
    }
    queryClient.setQueryData(
      ["drawing", projectId, userId, currentNumber],
      () => null
    );
  };

  const handleSave = async () => {
    const canvasRef = canvasRefs.current[currentNumber - 1];
    if (!canvasRef || !hasDrawings[currentNumber - 1]) return;
    console.log("Saving drawing");

    // Get the canvas element directly from the CanvasDraw component
    const sourceCanvas = (canvasRef as any).canvas.drawing;

    // Create a new canvas with white background
    const targetCanvas = document.createElement("canvas");
    targetCanvas.width = sourceCanvas.width;
    targetCanvas.height = sourceCanvas.height;
    const ctx = targetCanvas.getContext("2d");
    if (!ctx) {
      console.error("Unable to get 2D context");
      return;
    }

    // Fill with white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);

    // Draw the original canvas content onto the new canvas
    ctx.drawImage(sourceCanvas, 0, 0);

    try {
      // Convert to blob
      const blob = await new Promise<Blob>((resolve) =>
        targetCanvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.95)
      );
      if (!blob) {
        throw new Error("Failed to create blob");
      }

      const filename = `${currentNumber}.jpg`;
      const file = new File([blob], filename, { type: "image/jpeg" });
      const { data, error } = await supabase.storage
        .from("projects")
        .upload(`${projectId}/${userId}/${filename}`, file, { upsert: true });

      if (error) {
        console.error("Error uploading drawing:", error);
        return;
      }

      // Manually update the cache
      queryClient.setQueryData(
        ["drawing", projectId, userId, currentNumber],
        () => file
      );

      setHasDrawings((prev) => {
        const newHasDrawings = [...prev];
        newHasDrawings[currentNumber - 1] = false;
        return newHasDrawings;
      });

      queryClient.setQueryData<File[]>(
        getProjectFilesQueryKey(projectId),
        (files) => {
          if (!files) return files;
          const newFiles = [...files];
          newFiles[currentNumber - 1] = file;
          return newFiles;
        }
      );
    } catch (error) {
      console.error("Error in handleSave:", error);
    }
  };

  const handleNext = async () => {
    if (
      currentNumber < 11 &&
      (hasDrawings[currentNumber - 1] || currentDrawing)
    ) {
      await handleSave();
      api?.scrollNext();
    } else if (currentNumber === 10) {
      api?.scrollNext();
    }
  };

  const handlePrevious = async () => {
    if (
      currentNumber > 1 &&
      (hasDrawings[currentNumber - 1] || currentDrawing)
    ) {
      await handleSave();
      api?.scrollPrev();
    } else if (currentNumber === 11) {
      api?.scrollPrev();
    }
  };

  function onOpenChange(open: boolean) {
    onClose();
    setCurrentNumber(1);
  }
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle>Draw the item matching the description</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center mt-4">
          <Carousel
            setApi={setApi}
            opts={{
              dragFree: true,
              watchDrag: false,
            }}
            className="w-full max-w-xs"
          >
            <CarouselContent>
              {Array.from({ length: 11 }).map((_, index) => (
                <CarouselItem key={index}>
                  {index < 10 ? (
                    <div className="flex flex-col items-center">
                      <h3 className="mb-2">Number {index + 1}</h3>
                      <div
                        className={cn(
                          "w-64 h-64 border border-gray-300",
                          currentNumber === index + 1 && currentDrawing
                            ? "bg-white"
                            : ""
                        )}
                      >
                        {currentNumber === index + 1 && currentDrawing ? (
                          <img
                            src={URL.createObjectURL(currentDrawing)}
                            alt={`Number ${index + 1}`}
                            className="w-full h-full pointer-events-none object-contain"
                            draggable={false}
                          />
                        ) : (
                          <CanvasDraw
                            ref={(ref) => (canvasRefs.current[index] = ref)}
                            brushColor="black"
                            brushRadius={2}
                            canvasWidth={256}
                            canvasHeight={256}
                            hideGrid
                            backgroundColor="white"
                            onChange={() => {
                              setHasDrawings((prev) => {
                                const newHasDrawings = [...prev];
                                newHasDrawings[index] = true;
                                return newHasDrawings;
                              });
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <h3 className="mb-2">All Drawings</h3>
                      <div className="relative">
                        <div className="grid w-[99%] h-[256px] overflow-y-auto grid-cols-2 gap-2">
                          {allDrawings.map((drawing, idx) =>
                            drawing ? (
                              <div
                                key={idx}
                                className="w-32 h-32 border border-gray-300 bg-white"
                              >
                                <Image
                                  src={URL.createObjectURL(drawing)}
                                  alt={`Drawing ${idx + 1}`}
                                  width={128}
                                  height={128}
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <div
                                key={idx}
                                className="w-32 h-32 border bg-white border-gray-300 flex items-center justify-center text-gray-400"
                              >
                                No drawing
                              </div>
                            )
                          )}
                        </div>
                        <div
                          className="absolute w-full bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent pointer-events-none"
                          aria-hidden="true"
                        />
                      </div>
                      <Button
                        onClick={() => onOpenChange(false)}
                        className="mt-4"
                      >
                        Okay
                      </Button>
                    </div>
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious onClick={handlePrevious} />
            <CarouselNext
              onClick={handleNext}
              disabled={currentNumber === 11 || !hasDrawings[currentNumber - 1]}
            />
          </Carousel>
          {currentNumber <= 10 && (
            <div className="mt-4 space-x-2">
              <Button
                disabled={!hasDrawings[currentNumber - 1]}
                onClick={handleClear}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DrawingModal;
