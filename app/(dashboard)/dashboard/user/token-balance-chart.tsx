"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format, parseISO } from "date-fns";

interface TokenBalanceChartProps {
  data: { date: string; balance: number }[];
}

export default function TokenBalanceChart({ data }: TokenBalanceChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), "d MMM"),
  }));
  return (
    <ChartContainer
      config={{
        balance: {
          label: "Token Balance",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[200px] sm:h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <XAxis dataKey="formattedDate" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="var(--color-balance)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
