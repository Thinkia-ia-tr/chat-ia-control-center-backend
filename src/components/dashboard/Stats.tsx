
import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { LineChart } from "@/components/ui/line-chart";

const conversationData = [
  { date: '2024-04-08', value: 12 },
  { date: '2024-04-09', value: 17 },
  { date: '2024-04-10', value: 15 },
  { date: '2024-04-11', value: 14 },
  { date: '2024-04-12', value: 13 },
  { date: '2024-04-13', value: 15 },
  { date: '2024-04-14', value: 25 },
];

const messageData = [
  { date: '2024-04-08', value: 25 },
  { date: '2024-04-09', value: 32 },
  { date: '2024-04-10', value: 28 },
  { date: '2024-04-11', value: 25 },
  { date: '2024-04-12', value: 30 },
  { date: '2024-04-13', value: 35 },
  { date: '2024-04-14', value: 40 },
];

export function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard 
        title="Conversaciones Totales" 
        value="15.231" 
        change="+20,1% desde el mes pasado"
      >
        <LineChart data={conversationData} />
      </StatCard>

      <StatCard 
        title="Mensajes Totales" 
        value="15.231" 
        change="+20,1% desde el mes pasado"
      >
        <LineChart data={messageData} />
      </StatCard>
    </div>
  );
}
