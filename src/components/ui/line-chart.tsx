
import React from "react";
import { LineChart as RechartsLineChart, Line, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface LineChartProps {
  data: { date: string; value: number }[];
  color?: string;
  className?: string;
}

export function LineChart({ data, color = "var(--chart-primary)", className }: LineChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <XAxis 
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), "dd MMM", { locale: es })}
            tick={{ fontSize: 12 }}
            tickMargin={8}
          />
          <Tooltip 
            labelFormatter={(date) => format(new Date(date), "dd MMM yyyy", { locale: es })}
            formatter={(value: number) => [value, "Cantidad"]}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2} 
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 4 }}
            isAnimationActive={true}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
