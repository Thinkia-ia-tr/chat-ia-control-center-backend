
import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { LineChart } from "@/components/ui/line-chart";
import { subDays, format } from "date-fns";
import { BriefcaseIcon, HeadphonesIcon, WrenchIcon, CalculatorIcon, UsersIcon } from "lucide-react";

// Generar datos de ejemplo para un mes
const generateMonthData = () => {
  const data = [];
  for (let i = 30; i >= 0; i--) {
    const date = subDays(new Date(), i);
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      value: Math.floor(Math.random() * 10) + 1 // Valores entre 1 y 10
    });
  }
  return data;
};

const referralTypes = [
  { title: "Asesor Comercial", value: "124", change: "+12,5%", icon: BriefcaseIcon, color: "hsl(var(--primary))" },
  { title: "Atención al Cliente", value: "89", change: "+8,2%", icon: HeadphonesIcon, color: "#0EA5E9" },
  { title: "Soporte Técnico", value: "67", change: "+15,3%", icon: WrenchIcon, color: "#8B5CF6" },
  { title: "Presupuestos", value: "45", change: "+5,7%", icon: CalculatorIcon, color: "#F97316" },
  { title: "Colaboraciones", value: "32", change: "+9,1%", icon: UsersIcon, color: "#6E59A5" }
];

export function ReferralStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {referralTypes.map((type) => {
        const Icon = type.icon;
        return (
          <StatCard 
            key={type.title}
            title={type.title}
            value={type.value}
            change={type.change}
            className="relative"
          >
            <Icon className="absolute top-4 right-4 text-muted-foreground/20 h-6 w-6" />
            <LineChart 
              data={generateMonthData()}
              color={type.color}
              className="h-full w-full"
            />
          </StatCard>
        )
      })}
    </div>
  );
}
