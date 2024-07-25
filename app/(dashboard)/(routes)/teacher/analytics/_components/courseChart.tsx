'use client';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {
  total: {
    label: 'Total Earnings',
    color: '#0369a1',
  },
} satisfies ChartConfig;

interface CourseChartProps {
  data: { name: string; total: number }[];
}

export const CourseChart = ({ data }: CourseChartProps) => {
  return (
    <div className="ml-100">
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid horizontal={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            fontSize={12}
            type="category"
          />
          <YAxis
            type="number"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => `MAD ${value}`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelKey="total"
                nameKey="MAD"
              />
            }
          />
          <Bar dataKey="total" fill="var(--color-total)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
