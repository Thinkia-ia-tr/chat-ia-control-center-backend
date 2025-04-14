
import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { LineChart } from "@/components/ui/line-chart";
import { subDays, format } from "date-fns";
import { es } from "date-fns/locale";

// Generar datos de ejemplo para un mes
const generateMonthData = () => {
  const data = [];
  for (let i = 30; i >= 0; i--) {
    const date = subDays(new Date(), i);
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      value: Math.floor(Math.random() * 20) + 10 // Valores entre 10 y 30
    });
  }
  return data;
};

const conversationData = generateMonthData();
const messageData = generateMonthData().map(item => ({
  ...item,
  value: item.value * 2 // Duplicamos los valores para mensajes
}));

export function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard 
        title="Conversaciones Totales" 
        value="15.231" 
        change="+20,1% desde el mes pasado"
      >
        <LineChart 
          data={conversationData}
          className="h-full w-full"
        />
      </StatCard>

      <StatCard 
        title="Mensajes Totales" 
        value="35.842" 
        change="+15,3% desde el mes pasado"
      >
        <LineChart 
          data={messageData}
          className="h-full w-full"
        />
      </StatCard>
    </div>
  );
}
