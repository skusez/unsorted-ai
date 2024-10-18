"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
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
import {
  For,
  Memo,
  observer,
  Show,
  useObservable,
} from "@legendapp/state/react";
import { Observable } from "@legendapp/state";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Check, Loader2, X } from "lucide-react";

const MAX_DRAWINGS = 6;
interface DrawingModalProps {
  isOpen$: Observable<boolean>;
}
type Drawing = {
  saveState: string | null;
  dataUrl: string;
  score: boolean | null;
};
const numberMap: { [key: string]: string[] } = {
  "1": ["1", "(", ")", "l", "0"],
  "2": ["2", "Z"],
  "3": ["3"],
  "4": ["4", "#"],
  "5": ["5"],
  "6": ["6"],
  "7": ["7"],
  "8": ["8", "#"],
  "9": ["9"],
  "10": ["10"],
};

const DrawingModal: React.FC<DrawingModalProps> = React.memo(({ isOpen$ }) => {
  const drawingState$ = useObservable({
    api: null as CarouselApi | null,
    current: 0,
    count: 0,
  });
  const isLastItem$ = useObservable(
    () => drawingState$.current.get() + 1 >= MAX_DRAWINGS
  );
  const loading$ = useObservable(false);
  const showSummary$ = useObservable(false);
  const drawings$ = useObservable<Drawing[]>([
    { saveState: null, dataUrl: "", score: null },
  ]);
  const api = drawingState$.api.get();
  const resetState = useCallback(() => {
    drawingState$.current.set(0);
    drawingState$.count.set(0);
    drawings$.set([{ saveState: null, dataUrl: "", score: null }]);
  }, [drawingState$, drawings$]);

  showSummary$.onChange(({ value }) => {
    if (value === false && !isOpen$.get()) resetState();
  });
  isOpen$.onChange(({ value }) => {
    if (value === false && !showSummary$.get()) resetState();
  });

  const onSubmit = async () => {
    loading$.set(true);
    try {
      await Promise.all(
        drawings$.map(async (drawing$, index) => {
          // Add a small delay to prevent overwhelming the server
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (!drawing$.dataUrl.peek()) {
            console.log(`Skipping empty drawing at index ${index}`);
            return null;
          }

          const label = (index + 1).toString();
          const formData = new FormData();
          formData.append("image", drawing$.dataUrl.peek());
          const response = await fetch(`/api/image-to-text`, {
            method: "POST",
            body: formData,
            cache: "no-store",
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `HTTP error! status: ${response.status}, message: ${errorText}`
            );
          }

          const data = await response.json();

          const numberResponse = data.caption[0].generated_text;
          console.log({ numberResponse, label });
          const isValid =
            numberMap[label].includes(numberResponse) ||
            numberResponse.includes(label.toString());

          drawing$.set((prev) => ({
            ...prev,
            score: isValid,
          }));

          return;
        })
      );

      showSummary$.set(true);
      loading$.set(false);

      return "Images processed successfully";
    } catch (error) {
      console.error("Error processing images:", error);
      loading$.set(false);
      toast.error("An error occurred. Please try again.");
      throw error;
    }
  };
  useEffect(() => {
    api?.on?.("select", (e) => {
      const number = e.selectedScrollSnap();
      drawingState$.current.set(number);
      drawingState$.count.set((prev) => (prev > number ? prev : number));
    });
  }, [api]);

  return (
    <>
      <Dialog open={isOpen$.get()} onOpenChange={isOpen$.set}>
        <DialogContent className="flex flex-col h-[450px] overflow-y-auto items-center justify-center">
          <DialogHeader>
            <DialogTitle>
              <Show
                if={drawingState$.current.get() + 1 > MAX_DRAWINGS}
                else={
                  <Memo>
                    {() => (
                      <>Draw the number {drawingState$.current.get() + 1}</>
                    )}
                  </Memo>
                }
              >
                Results
              </Show>
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
              <For each={drawings$}>
                {(drawing$, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-none">
                      <CardContent className="flex aspect-square items-center justify-center">
                        <DrawImage
                          drawing$={drawing$}
                          onChange={() => {
                            const id = Number(index);
                            if (id + 1 < MAX_DRAWINGS) {
                              drawings$[id + 1].set({
                                dataUrl: "",
                                saveState: null,
                                score: null,
                              });
                            }
                          }}
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                )}
              </For>
              <Show if={isLastItem$}>
                <CarouselItem
                  className={`${drawingState$.current.get() > MAX_DRAWINGS ? "hidden" : "block"}`}
                >
                  <Card className="border-none">
                    <CardContent className="flex flex-wrap gap-4 aspect-square h-[256px] overflow-y-auto">
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
                          toast.promise(onSubmit, {
                            loading: "Saving...",
                            success: "Saved!",
                            error: "Error saving",
                          });
                        }}
                        disabled={loading$.peek()}
                      >
                        <Show if={loading$} else={"Save"}>
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        </Show>
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              </Show>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </DialogContent>
      </Dialog>

      <Dialog open={showSummary$.get()} onOpenChange={showSummary$.set}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Drawing Results</DialogTitle>
            <DialogDescription>
              Here's a summary of your drawings and their results:
            </DialogDescription>
          </DialogHeader>
          <div
            className={`grid-cols-3 gap-4 ${showSummary$.get() ? "grid" : "hidden"}`}
          >
            <For each={drawings$}>
              {(drawing$, id) => {
                const drawing = drawing$.get();
                return (
                  <div className="text-center flex-col items-center justify-center">
                    <img
                      src={drawing.dataUrl}
                      alt={`Drawing ${Number(id) + 1}`}
                      className="w-24 h-24 mx-auto mb-2"
                    />
                    <div className="flex justify-center">
                      <Show
                        if={drawing$.score}
                        else={
                          <X className="size-5 rounded-full bg-red-500 p-0.5 text-white" />
                        }
                      >
                        <Check className="size-5 rounded-full bg-green-600 p-0.5 text-white" />
                      </Show>
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
          <DialogFooter>
            <Button onClick={() => showSummary$.set(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

const DrawImage = ({
  drawing$,
  onChange,
}: {
  drawing$: Observable<Drawing>;
  onChange: () => void;
}) => {
  let canvasRef = useRef<CanvasDraw | null>(null);

  if (canvasRef.current && drawing$.saveState.get()) {
    canvasRef.current.loadSaveData(drawing$.saveState.get() || "");
  }

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
          const values = {
            saveState: canvas.getSaveData(),
            // @ts-ignore
            dataUrl: canvas.getDataURL("png", false, "#ffffff"),
            score: null,
          };

          drawing$.set(values);

          onChange();
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
