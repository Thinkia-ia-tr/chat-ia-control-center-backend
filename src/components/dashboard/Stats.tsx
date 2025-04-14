
import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { LineChart } from "@/components/ui/line-chart";

const conversationData = [
  { value: 12 },
  { value: 17 },
  { value: 15 },
  { value: 14 },
  { value: 13 },
  { value: 15 },
  { value: 25 },
];

const messageData = [
  { value: 25 },
  { value: 32 },
  { value: 28 },
  { value: 25 },
  { value: 30 },
  { value: 35 },
  { value: 40 },
];

export function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard 
        title="Conversaciones Totales" 
        value="$15,231.89" 
        change="+20.1% from last month"
      >
        <LineChart data={conversationData} />
      </StatCard>

      <StatCard 
        title="Mensajes Totales" 
        value="$15,231.89" 
        change="+20.1% from last month"
      >
        <LineChart data={messageData} />
      </StatCard>
    </div>
  );
}

