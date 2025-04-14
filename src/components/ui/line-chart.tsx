
import React from "react";
import { LineChart as RechartsLineChart, Line, ResponsiveContainer, XAxis, Tooltip, YAxis } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface LineChartProps {
  data: { date: string; value: number }[];
  color?: string;
  className?: string;
}

export function LineChart({ data, color = "hsl(var(--chart-primary))", className }: LineChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <XAxis 
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), "dd MMM", { locale: es })}
            tick={{ fontSize: 12 }}
            tickMargin={8}
            interval="preserveStartEnd"
          />
          <YAxis 
            hide={true}
          />
          <Tooltip 
            labelFormatter={(date) => format(new Date(date), "dd MMM yyyy", { locale: es })}
            formatter={(value: number) => [value, "Cantidad"]}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 4, fill: color }}
            isAnimationActive={true}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
