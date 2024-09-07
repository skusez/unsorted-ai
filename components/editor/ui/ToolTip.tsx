import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  label: string;
  children: React.ReactNode;
  sideOffset?: number;
  side?: "right" | "left" | "bottom" | "top" | undefined;
};

export function ToolTip({ label, children, sideOffset, side }: Props) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild suppressHydrationWarning>
          {children}
        </TooltipTrigger>
        <TooltipContent sideOffset={sideOffset} side={side}>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
