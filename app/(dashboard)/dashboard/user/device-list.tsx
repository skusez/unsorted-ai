import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Device {
  name: string;
  status: "online" | "offline";
  tokensEarned: number;
}

interface DeviceListProps {
  devices: Device[];
}

export default function DeviceList({ devices }: DeviceListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {devices.map((device) => (
        <Card key={device.name} className="flex flex-col">
          <CardHeader>
            <CardTitle className="relative">
              {device.name}
              <Button
                variant="ghost"
                size="none"
                className="absolute right-0 top-0"
              >
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger>
                      <Settings className="size-5" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Configure</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Button>
            </CardTitle>
            <CardDescription>
              <Badge
                variant={device.status === "online" ? "default" : "secondary"}
              >
                {device.status}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{device.tokensEarned} tokens</p>
              <p className="text-sm text-muted-foreground">
                earned in the last 24 hours
              </p>
            </div>
            <div className="relative hover:scale-110 cursor-pointer transition-all duration-300 w-24 h-24 ">
              <Image
                src={`/images/${device.name.toLowerCase().replace(" ", "-")}.png`}
                alt={device.name}
                layout="fill"
                objectFit="contain"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
